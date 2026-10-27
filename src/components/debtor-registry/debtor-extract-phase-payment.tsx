import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ApplePayBrand, BankOfGeorgiaBrand } from '@/constants/payment-brands';
import { useAppTheme } from '@/theme';
import type { DebtorExtractPaymentMethod } from '@/types/debtor-extract';
import { getDebtorExtractPaymentOptions } from '@/utils/debtor-extract-payment-options';

import { PaymentMethodBrandIcon } from './payment-method-brand-icon';

type Props = {
  selected: DebtorExtractPaymentMethod;
  onSelect: (m: DebtorExtractPaymentMethod) => void;
  onPay: () => void;
  paying?: boolean;
  /** Payable amount from the backend; falls back to the static fee when absent. */
  amount?: number | null;
};

export function DebtorExtractPhasePayment({
  selected,
  onSelect,
  onPay,
  paying,
  amount,
}: Props) {
  const { t } = useTranslation();
  const { colors, shadows } = useAppTheme();
  const methods = useMemo(() => getDebtorExtractPaymentOptions(), []);
  const feeText =
    amount != null
      ? t('debtors.detailPaidAmountValue', { amount: amount.toFixed(2) })
      : t('debtors.extractFeeAmount');
  return (
    <>
      <View
        className="items-center gap-1 rounded-xl border border-border-strong bg-surface-sunken p-5"
        style={shadows.md}>
        <Text className="text-label font-semibold text-fg-secondary">
          {t('debtors.extractFeeTitle')}
        </Text>
        <Text className="text-title font-extrabold text-fg">{feeText}</Text>
      </View>
      <Text className="mb-1 text-body font-bold text-fg">{t('debtors.extractMethodsTitle')}</Text>
      <View className="gap-4">
        {methods.map((m) => {
          const isOn = selected === m.id;
          const accentColor =
            m.id === 'bankOfGeorgia'
              ? BankOfGeorgiaBrand.primary
              : m.id === 'applePay'
                ? ApplePayBrand.background
                : undefined;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isOn }}
              onPress={() => onSelect(m.id)}
              className={`min-h-[56px] flex-row items-center gap-4 rounded-xl border bg-surface px-4 py-4 ${
                isOn ? 'border-2 border-fg bg-surface-sunken' : 'border-border'
              } ${accentColor ? 'border-l-4' : ''}`}
              style={[shadows.md, accentColor ? { borderLeftColor: accentColor } : null]}>
              <PaymentMethodBrandIcon
                methodId={m.id}
                fallbackIcon={m.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              />
              <Text className="flex-1 text-body font-semibold text-fg" numberOfLines={2}>
                {t(m.labelKey)}
              </Text>
              {isOn ? (
                <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
              ) : (
                <View className="h-[22px] w-[22px] rounded-full border-2 border-input-border" />
              )}
            </Pressable>
          );
        })}
      </View>
      <Button label={t('debtors.extractPayButton')} onPress={onPay} disabled={paying} />
    </>
  );
}
