import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import { LoginPalette } from '@/constants/login';
import { ToastLayout } from '@/constants/toast';
import { useCreateDebtorApp } from '@/hooks/use-create-debtor-app';
import { useDebtorApp } from '@/hooks/use-debtor-app';
import { useUpdateDebtorApp } from '@/hooks/use-update-debtor-app';
import type { DebtorExtractPaymentMethod } from '@/types/debtor-extract';
import { defaultDebtorExtractPaymentMethod } from '@/utils/debtor-extract-payment-options';

import { debtorAppDetailActionsStyles as da } from './debtor-app-detail-actions.styles';
import { DebtorAppEditModal } from './debtor-app-edit-modal';
import { DebtorExtractPhasePayment } from './debtor-extract-phase-payment';
import { debtorExtractRequestStyles as s } from './debtor-extract-request.styles';
import { DebtorExtractSubheader } from './debtor-extract-subheader';

type Params = {
  id: string;
  applicantName?: string;
  applicantId?: string;
  applicantPhone?: string;
  applicantAddress?: string;
};

/** Keeps the input look throughout; omitting `onChangeText` renders it disabled
 *  — used for the applicant block and for every field once recorded. */
function Field({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  keyboardType?: 'number-pad' | 'phone-pad';
}) {
  const editable = Boolean(onChangeText);
  return (
    <View style={s.fieldGap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        placeholderTextColor={LoginPalette.placeholderMuted}
        style={[s.input, !editable && s.inputDisabled]}
      />
    </View>
  );
}

export function DebtorAppExtractRequestScreen() {
  const { t } = useTranslation();
  const { id, applicantName, applicantId, applicantPhone, applicantAddress } =
    useLocalSearchParams<Params>();
  const appId = Number(id);
  const query = useDebtorApp(Number.isFinite(appId) ? appId : null);
  const app = query.data;

  const [subjectId, setSubjectId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectAddress, setSubjectAddress] = useState('');
  const [payCode, setPayCode] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  // Pay button switches the screen to the fee/methods phase (shared with the
  // old extract flow); back returns to the form.
  const [phase, setPhase] = useState<'form' | 'payment'>('form');
  const [method, setMethod] = useState<DebtorExtractPaymentMethod>(
    defaultDebtorExtractPaymentMethod,
  );

  // Set once recorded — locks the form and switches editing over to PUT.
  const [createdAppId, setCreatedAppId] = useState<number | null>(null);
  const isRecorded = createdAppId !== null;

  const createMutation = useCreateDebtorApp();
  const updateMutation = useUpdateDebtorApp(createdAppId);

  // Seed the requested-person fields once the app detail arrives.
  useEffect(() => {
    setSubjectId(app?.requestedPerson?.idnumber ?? '');
    setSubjectName(app?.requestedPerson?.personName ?? '');
    setSubjectAddress(app?.requestedPerson?.address ?? '');
  }, [
    app?.requestedPerson?.idnumber,
    app?.requestedPerson?.personName,
    app?.requestedPerson?.address,
  ]);

  const handleRecord = () => {
    createMutation.mutate(
      {
        personName: subjectName.trim(),
        idnumber: subjectId.trim(),
        address: subjectAddress.trim() || undefined,
        addInfo: app?.requestedPerson?.addInfo ?? undefined,
        note: app?.requestedPerson?.note ?? undefined,
      },
      {
        onSuccess: ({ app: created, payCode: fetchedPayCode }) => {
          setPayCode(fetchedPayCode);
          setCreatedAppId(created.id);
        },
      },
    );
  };

  const handleEditSave = ({ name, idnumber }: { name: string; idnumber: string }) => {
    // Before recording there is nothing to PUT to — just update the draft.
    if (!isRecorded) {
      setSubjectName(name);
      setSubjectId(idnumber);
      setEditVisible(false);
      return;
    }
    updateMutation.mutate(
      {
        personName: name,
        idnumber,
        address: subjectAddress.trim() || undefined,
        addInfo: app?.requestedPerson?.addInfo ?? undefined,
        note: app?.requestedPerson?.note ?? undefined,
      },
      {
        onSuccess: () => {
          setSubjectName(name);
          setSubjectId(idnumber);
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
  };

  return (
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <DebtorExtractSubheader
          title={t('debtors.extractRequestButton')}
          backA11y={t('debtors.extractBackA11y')}
          onBack={() => (phase === 'payment' ? setPhase('form') : router.back())}
        />
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled">
          {phase === 'payment' ? (
            <DebtorExtractPhasePayment
              selected={method}
              onSelect={setMethod}
              onPay={() => {
                // TODO: wire the real payment once the backend endpoint exists.
              }}
            />
          ) : (
            <>
          <View style={s.sectionCard}>
            <Text style={s.sectionTitle}>{t('debtors.extractApplicantSection')}</Text>
            <Field label={t('debtors.extractApplicantPnLabel')} value={applicantId ?? ''} />
            <Field
              label={t('debtors.extractApplicantNameLabel')}
              value={applicantName ?? ''}
            />
            <Field
              label={t('debtors.extractApplicantPhoneLabel')}
              value={applicantPhone ?? ''}
            />
            <Field label={t('debtors.detailsLabelAddress')} value={applicantAddress ?? ''} />
            {payCode ? (
              <Field label={t('debtors.detailLabelPayCode')} value={payCode} />
            ) : null}
          </View>
          <View style={s.sectionCard}>
            <Text style={s.sectionTitle}>{t('debtors.extractSubjectSection')}</Text>
            {/* Locked like the applicant block — changes go through the edit modal. */}
            <Field label={t('debtors.extractSubjectIdLabel')} value={subjectId} />
            <Field label={t('debtors.extractSubjectNameLabel')} value={subjectName} />
            <Field label={t('debtors.detailsLabelAddress')} value={subjectAddress} />
          </View>
          <Pressable
            style={[
              da.fullBtn,
              (createMutation.isPending || isRecorded) && da.btnDisabled,
            ]}
            accessibilityRole="button"
            disabled={createMutation.isPending || isRecorded}
            onPress={handleRecord}>
            <Text style={da.payLabel}>{t('debtors.extractRecordButton')}</Text>
          </Pressable>
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
              onPress={() => setPhase('payment')}>
              <Text style={da.payLabel}>{t('debtors.detailPayButton')}</Text>
            </Pressable>
          </View>
            </>
          )}
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
      <DebtorAppEditModal
        visible={editVisible}
        name={subjectName}
        idnumber={subjectId}
        saving={updateMutation.isPending}
        onClose={() => setEditVisible(false)}
        onSave={handleEditSave}
      />
    </View>
  );
}
