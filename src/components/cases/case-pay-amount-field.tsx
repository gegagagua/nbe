import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { casePayAmountFieldStyles as s } from './case-pay-amount-field.styles';

type Props = {
  /** Maximum payable amount. The field defaults to this and clamps to it. */
  maxAmount: number;
  /** Currency unit shown after the amount in the button label (e.g. "GEL"). */
  currencySuffix?: string;
  /** Disables the input/button while a payment is in flight. */
  isPaying?: boolean;
  /** Nothing to collect (fully paid / overpaid): shows the raw amount, blocks payment. */
  isNonPayable?: boolean;
  /** Invoked with the clamped amount the user chose to pay. */
  onPay: (amount: number) => void;
};

/**
 * Shared payment-amount field used by both the guest-fine and logged-in flows
 * so the "amount to pay" input and pay button look and behave identically.
 * Owns the editable amount, clamped to [1, maxAmount].
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

  // Numeric amount actually charged, clamped to [1, maxAmount].
  const payValue = useMemo(() => {
    const n = Number.parseFloat(amountInput.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n)) return NaN;
    let value = n < 1 ? 1 : n;
    if (Number.isFinite(maxAmount) && value > maxAmount) value = maxAmount;
    return value;
  }, [amountInput, maxAmount]);

  const handleAmountChange = (text: string) => {
    setAmountInput(text.replace(/[^\d.]/g, ''));
  };

  // Normalise the field to the clamped value when focus leaves it.
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
      <View style={s.payAmountWrap}>
        <Text style={s.payAmountLabel}>{t('cases.detailPayAmountLabel')}</Text>
        <TextInput
          style={s.payInput}
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
      <Pressable
        style={[s.payButton, (isPaying || isNonPayable) && s.payButtonDisabled]}
        onPress={handlePress}
        disabled={isPaying || isNonPayable}
        accessibilityRole="button"
        accessibilityLabel={t('cases.detailPayButton')}>
        <Text style={s.payButtonText}>{payButtonLabel}</Text>
      </Pressable>
    </>
  );
}
