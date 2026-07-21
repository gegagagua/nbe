import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { PaymentWebViewModal } from '@/components/ui/payment-web-view-modal';
import { useGuestFinePayment } from '@/hooks/use-guest-fine-payment';
import { showErrorToast } from '@/lib/show-error-toast';
import type { GuestFineCheckResult } from '@/types/guest-fine';

import { CaseDetailExtraInfoModalView } from './case-detail-extra-info-modal';
import { caseDetailInternalStyles as cd } from './case-detail-internal.styles';
import { caseGuestFinePanelStyles as s } from './case-guest-fine-panel.styles';
import { CasePayAmountField } from './case-pay-amount-field';

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

  function handlePay(payValue: number) {
    if (result.paymentContext) {
      // Charge the (possibly corrected) amount the user entered.
      startPayment({ ...result.paymentContext, amount: payValue });
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
      </View>
      <CasePayAmountField
        maxAmount={maxAmount}
        currencySuffix={currencySuffix}
        isPaying={isPaying}
        onPay={handlePay}
      />
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
