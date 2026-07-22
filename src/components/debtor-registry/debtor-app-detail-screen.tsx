import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import { ToastLayout } from '@/constants/toast';
import { useDebtorApp } from '@/hooks/use-debtor-app';
import { useUpdateDebtorApp } from '@/hooks/use-update-debtor-app';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

import { debtorAppDetailActionsStyles as da } from './debtor-app-detail-actions.styles';
import { DebtorAppEditModal } from './debtor-app-edit-modal';
import { debtorExtractRequestStyles as s } from './debtor-extract-request.styles';
import { DebtorExtractSubheader } from './debtor-extract-subheader';
import { DebtorRegistryApplicationRowActions } from './debtor-registry-application-row-actions';

type DetailParams = {
  id: string;
  applicantName?: string;
  applicantId?: string;
  payCode?: string;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.fieldGap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={s.readonlyValue}>{value}</Text>
    </View>
  );
}

export function DebtorAppDetailScreen() {
  const { t } = useTranslation();
  const { id, applicantName, applicantId, payCode } = useLocalSearchParams<DetailParams>();
  const appId = Number(id);
  const query = useDebtorApp(Number.isFinite(appId) ? appId : null);
  const app = query.data;

  // Cases whose registration number starts with "DE" are registered; the rest
  // only have a preliminary number and no extract yet.
  const regnumber = app?.regnumber?.trim() ?? '';
  const isRegistered = regnumber.toUpperCase().startsWith('DE');

  const [editVisible, setEditVisible] = useState(false);
  const updateMutation = useUpdateDebtorApp(Number.isFinite(appId) ? appId : null);

  const requested = app?.requestedPerson;

  return (
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <DebtorExtractSubheader
          title={t('debtors.detailsTitlePrefix')}
          backA11y={t('debtors.extractBackA11y')}
          onBack={() => router.back()}
        />
        <ScrollView style={s.scroll} contentContainerStyle={s.content}>
          {query.isPending ? (
            <Text style={s.hintText}>{t('debtors.loadingMessage')}</Text>
          ) : null}
          {app ? (
            <>
              {isRegistered ? (
                <View style={s.sectionCard}>
                  <Text style={s.sectionTitle}>{t('debtors.detailRegisteredCase')}</Text>
                  <Field
                    label={t('debtors.detailLabelRegNumberTime')}
                    value={`${regnumber} ${formatEnforcementDateTime(app.regDate)}`}
                  />
                </View>
              ) : null}
              <View style={s.sectionCard}>
                <Text style={s.sectionTitle}>{t('debtors.extractApplicantSection')}</Text>
                <Field
                  label={t('debtors.firstNameLabel')}
                  value={applicantName?.trim() || app.createdBy?.name || '—'}
                />
                <Field
                  label={t('debtors.detailsLabelPersonalId')}
                  value={applicantId?.trim() || '—'}
                />
                <Field label={t('debtors.detailLabelPayCode')} value={payCode?.trim() || '—'} />
              </View>
              <View style={s.sectionCard}>
                <Text style={s.sectionTitle}>{t('debtors.extractSubjectSection')}</Text>
                <Field
                  label={t('debtors.extractSubjectNameLabel')}
                  value={requested?.personName || '—'}
                />
                <Field
                  label={t('debtors.extractSubjectIdLabel')}
                  value={requested?.idnumber || '—'}
                />
              </View>
              <View style={s.sectionCard}>
                <Text style={s.sectionTitle}>{t('debtors.detailPaymentSection')}</Text>
                <Field label={t('debtors.detailLabelPaidAmount')} value="—" />
                <Field label={t('debtors.detailLabelPaidAt')} value="—" />
                <Field label={t('debtors.detailLabelBank')} value="—" />
                <Field label={t('debtors.detailLabelReceiptNo')} value="—" />
              </View>
              {isRegistered ? (
                <DebtorRegistryApplicationRowActions app={app} />
              ) : (
                // Visual-only actions for recorded (not-yet-registered) cases.
                <View style={da.row}>
                  <Pressable
                    style={[da.btn, da.editBtn]}
                    accessibilityRole="button"
                    onPress={() => setEditVisible(true)}>
                    <Text style={da.editLabel}>{t('debtors.detailEditButton')}</Text>
                  </Pressable>
                  <Pressable
                    style={[da.btn, da.payBtn]}
                    accessibilityRole="button"
                    onPress={() => {}}>
                    <Text style={da.payLabel}>{t('debtors.detailPayButton')}</Text>
                  </Pressable>
                </View>
              )}
            </>
          ) : null}
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
      <DebtorAppEditModal
        visible={editVisible}
        name={requested?.personName ?? ''}
        idnumber={requested?.idnumber ?? ''}
        saving={updateMutation.isPending}
        onClose={() => setEditVisible(false)}
        onSave={({ name, idnumber }) => {
          updateMutation.mutate(
            {
              personName: name,
              idnumber,
              // Preserve the other requested-person fields the form doesn't edit.
              address: requested?.address ?? undefined,
              addInfo: requested?.addInfo ?? undefined,
              note: requested?.note ?? undefined,
            },
            {
              onSuccess: () => {
                Toast.show({
                  type: 'success',
                  text1: t('debtors.detailEditSuccess'),
                  visibilityTime: ToastLayout.visibilityMs,
                  position: 'top',
                });
                setEditVisible(false);
              },
            },
          );
        }}
      />
    </View>
  );
}
