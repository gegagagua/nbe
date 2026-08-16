import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import { ToastLayout } from '@/constants/toast';
import { PaymentWebViewModal } from '@/components/ui/payment-web-view-modal';
import { useDebtorApp } from '@/hooks/use-debtor-app';
import { useDebtorAppPayments } from '@/hooks/use-debtor-app-payments';
import { useDebtorAppPersons } from '@/hooks/use-debtor-app-persons';
import { useDebtorPayment } from '@/hooks/use-debtor-payment';
import { useUpdateDebtorApp } from '@/hooks/use-update-debtor-app';
import { showErrorToast } from '@/lib/show-error-toast';
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
  const paymentsQuery = useDebtorAppPayments(Number.isFinite(appId) ? appId : null);
  const payments = paymentsQuery.data ?? [];
  const { personId } = useDebtorAppPersons(Number.isFinite(appId) ? appId : null);
  const { paymentUrl, startPayment, closePayment, isPaying, isPaid } =
    useDebtorPayment();

  // A settled, successful payment ends the flow — go back to the list. A failed
  // one leaves the user here so they can try again.
  useEffect(() => {
    if (!isPaid) return;
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/debtors');
    }
  }, [isPaid]);

  const handlePay = () => {
    const amount = app?.payableAmount ?? 0;
    if (personId == null) {
      showErrorToast(t('debtors.payError'), new Error('personId missing'));
      return;
    }
    if (!(amount > 0)) {
      Toast.show({
        type: 'info',
        text1: t('debtors.payNoAmount'),
        visibilityTime: ToastLayout.visibilityMs,
        position: 'top',
      });
      return;
    }
    startPayment({ appId, personId, amount });
  };

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
                  label={t('debtors.extractApplicantPnLabel')}
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
                {payments.length === 0 ? (
                  <Text style={s.hintText}>{t('debtors.detailNoPayments')}</Text>
                ) : (
                  payments.map((payment) => (
                    <View key={payment.id} style={s.fieldGap}>
                      <Field
                        label={t('debtors.detailLabelPaidAmount')}
                        value={
                          payment.amount != null
                            ? t('debtors.detailPaidAmountValue', {
                                amount: payment.amount.toFixed(2),
                              })
                            : '—'
                        }
                      />
                      <Field
                        label={t('debtors.detailLabelPaidAt')}
                        value={formatEnforcementDateTime(payment.paymentDate)}
                      />
                      <Field
                        label={t('debtors.detailLabelBank')}
                        value={payment.bank?.name || '—'}
                      />
                      <Field
                        label={t('debtors.detailLabelReceiptNo')}
                        value={payment.paymentId || '—'}
                      />
                    </View>
                  ))
                )}
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
                    style={[da.btn, da.payBtn, isPaying && da.btnDisabled]}
                    accessibilityRole="button"
                    disabled={isPaying}
                    onPress={handlePay}>
                    <Text style={da.payLabel}>{t('debtors.extractPayButton')}</Text>
                  </Pressable>
                </View>
              )}
            </>
          ) : null}
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
      <PaymentWebViewModal
        visible={paymentUrl != null}
        url={paymentUrl}
        onClose={closePayment}
      />
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
