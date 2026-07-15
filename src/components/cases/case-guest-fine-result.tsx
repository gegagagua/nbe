import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { PaymentWebViewModal } from '@/components/ui/payment-web-view-modal';
import { useGuestFinePayment } from '@/hooks/use-guest-fine-payment';
import { showErrorToast } from '@/lib/show-error-toast';
import type { GuestFineCheckResult } from '@/types/guest-fine';

import { CaseDetailExtraInfoModalView } from './case-detail-extra-info-modal';
import { caseDetailInternalStyles as cd } from './case-detail-internal.styles';
import { caseGuestFinePanelStyles as s } from './case-guest-fine-panel.styles';

type Props = {
  result: GuestFineCheckResult;
  // Called after the payment intent sync-status finishes so the guest case
  // screen can be reloaded back to its initial check state.
  onPaymentSynced?: () => void;
};

export function CaseGuestFineResult({ result, onPaymentSynced }: Props) {
  const { t } = useTranslation();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { paymentUrl, closePayment, openPaymentUrl, startPayment, isPaying } =
    useGuestFinePayment({ onSynced: onPaymentSynced });

  // Maximum payable amount taken from the checked debt. The user may lower the
  // charged amount down to a minimum of 1 (partial payment / amount correction).
  const maxAmount = useMemo(() => {
    const n = Number.parseFloat((result.amount ?? '').replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : NaN;
  }, [result.amount]);

  // Currency unit kept alongside the editable numeric amount (e.g. "GEL"),
  // derived from the displayed amount string just like the logged-in screen.
  const currencySuffix = useMemo(() => {
    const fromAmount = (result.amount ?? '').replace(/[\d.,\s]/g, '').trim();
    return fromAmount || result.currency || 'GEL';
  }, [result.amount, result.currency]);

  const [amountInput, setAmountInput] = useState<string>(
    Number.isFinite(maxAmount) ? String(maxAmount) : '',
  );

  const payValue = useMemo(() => {
    const n = Number.parseFloat(amountInput.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n)) return NaN;
    let value = n < 1 ? 1 : n;
    if (Number.isFinite(maxAmount) && value > maxAmount) value = maxAmount;
    return value;
  }, [amountInput, maxAmount]);

  const handleAmountChange = (text: string) => setAmountInput(text.replace(/[^\d.]/g, ''));

  const handleAmountBlur = () => {
    if (Number.isFinite(payValue)) {
      setAmountInput(String(payValue));
    } else if (Number.isFinite(maxAmount)) {
      setAmountInput(String(maxAmount));
    }
  };

  function handlePay() {
    if (result.paymentContext) {
      // Charge the (possibly corrected) amount the user entered.
      const amount = Number.isFinite(payValue) ? payValue : result.paymentContext.amount;
      startPayment({ ...result.paymentContext, amount });
      return;
    }
    if (result.paymentUrl) {
      openPaymentUrl(result.paymentUrl);
      return;
    }
    showErrorToast(t('cases.detailPaySoonToast'));
  }

  if (!result.found || (!result.personName && !result.amount)) {
    return (
      <View style={s.resultCard}>
        <Text style={s.notFound}>{t('cases.guestFine.notFound')}</Text>
      </View>
    );
  }

  // Amount correction is only possible when paying via a structured payment
  // context (the BOG intent is built from the edited amount).
  const canEditAmount = result.paymentContext != null && Number.isFinite(maxAmount);

  // Reflect the editable amount in the pay button label, like the logged-in screen.
  const payButtonLabel =
    canEditAmount && Number.isFinite(payValue)
      ? `${t('cases.detailPayButton')} · ${payValue}${
          currencySuffix ? ` ${currencySuffix}` : ''
        }`
      : t('cases.detailPayButton');

  return (
    <>
      <View style={s.resultCard}>
        {result.personName ? (
          <>
            <Text style={s.resultLabel}>{t('cases.guestFine.personNameLabel')}</Text>
            <Text style={s.resultValue}>{result.personName}</Text>
          </>
        ) : null}
        {result.personIdnumber ? (
          <>
            <Text style={s.resultLabel}>{t('cases.personalIdNumberLabel')}</Text>
            <Text style={s.resultMeta}>{result.personIdnumber}</Text>
          </>
        ) : null}
        {result.details && result.details.length > 0 ? (
          <Pressable
            style={[cd.detailsBtn, s.detailsButton]}
            onPress={() => setDetailsOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={t('cases.detail.detailsButtonA11y')}
          >
            <Text style={cd.detailsBtnText}>{t('cases.detail.detailsButton')}</Text>
          </Pressable>
        ) : null}
        {result.amount ? (
          <>
            <Text style={s.resultLabel}>{t('cases.guestFine.debtAmountLabel')}</Text>
            {canEditAmount ? (
              <TextInput
                style={s.amountInput}
                value={amountInput}
                onChangeText={handleAmountChange}
                onBlur={handleAmountBlur}
                keyboardType="numeric"
                inputMode="numeric"
                editable={!isPaying}
                placeholder={String(maxAmount)}
                accessibilityLabel={t('cases.detailPayAmountLabel')}
              />
            ) : (
              <Text style={s.resultAmount}>
                {result.amount} {currencySuffix}
              </Text>
            )}
          </>
        ) : null}
        <Button
          label={payButtonLabel}
          onPress={handlePay}
          disabled={isPaying}
        />
      </View>
      <CaseDetailExtraInfoModalView
        visible={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        rows={result.details}
        isLoading={false}
      />
      <PaymentWebViewModal
        visible={paymentUrl != null}
        url={paymentUrl}
        onClose={closePayment}
      />
    </>
  );
}
