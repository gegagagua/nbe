import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';

type Props = {
  /**
   * Debt amount used as the field's default/prefill value. It is NOT a hard
   * cap — the user may enter a larger amount than this (overpayment).
   */
  maxAmount: number;
  /** Currency unit shown after the amount in the button label (e.g. "GEL"). */
  currencySuffix?: string;
  /** Disables the input/button while a payment is in flight. */
  isPaying?: boolean;
  /** Nothing to collect (fully paid / overpaid): shows the raw amount, blocks payment. */
  isNonPayable?: boolean;
  /** Invoked with the amount the user chose to pay (floored at 1). */
  onPay: (amount: number) => void;
};

/**
 * Shared payment-amount field used by both the guest-fine and logged-in flows
 * so the "amount to pay" input and pay button look and behave identically.
 * Owns the editable amount, floored at 1 with no upper cap (overpayment
 * allowed) — it only prefills to the debt amount.
 */
export function CasePayAmountField({
  maxAmount,
  currencySuffix = '',
  isPaying = false,
  isNonPayable = false,
  onPay,
}: Props) {
  const { t } = useTranslation();

  const [amountInput, setAmountInput] = useState<string>(
    Number.isFinite(maxAmount) ? String(maxAmount) : '',
  );

  // Numeric amount actually charged. Floored at 1; NOT capped to the debt so
  // the user can enter a larger amount than the shown balance (overpayment).
  const payValue = useMemo(() => {
    const n = Number.parseFloat(amountInput.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n)) return NaN;
    return n < 1 ? 1 : n;
  }, [amountInput]);

  const handleAmountChange = (text: string) => {
    setAmountInput(text.replace(/[^\d.]/g, ''));
  };

  // Normalise the field to the floored value when focus leaves it.
  const handleAmountBlur = () => {
    if (Number.isFinite(payValue)) {
      setAmountInput(String(payValue));
    } else if (Number.isFinite(maxAmount)) {
      setAmountInput(String(maxAmount));
    }
  };

  const suffix = currencySuffix ? ` ${currencySuffix}` : '';
  const payButtonLabel = isNonPayable
    ? `${maxAmount}${suffix}`
    : Number.isFinite(payValue)
      ? `${t('cases.detailPayButton')} · ${payValue}${suffix}`
      : t('cases.detailPayButton');

  const handlePress = () => {
    if (Number.isFinite(payValue)) onPay(payValue);
  };

  return (
    <>
      <View className="mt-2 gap-1">
        <Text className="text-label font-bold text-fg">{t('cases.detailPayAmountLabel')}</Text>
        <TextInput
          className="h-11 rounded-sm border border-input bg-input px-4 text-body text-fg"
          value={amountInput}
          onChangeText={handleAmountChange}
          onBlur={handleAmountBlur}
          keyboardType="numeric"
          inputMode="numeric"
          editable={!isPaying && !isNonPayable}
          placeholder={String(maxAmount)}
          accessibilityLabel={t('cases.detailPayAmountLabel')}
        />
      </View>
      <Button
        label={payButtonLabel}
        onPress={handlePress}
        disabled={isPaying || isNonPayable}
        accessibilityLabel={t('cases.detailPayButton')}
        style={{ marginTop: 8 }}
      />
    </>
  );
}
