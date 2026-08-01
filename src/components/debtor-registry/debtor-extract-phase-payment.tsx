import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import type { DebtorExtractPaymentMethod } from '@/types/debtor-extract';
import { getDebtorExtractPaymentOptions } from '@/utils/debtor-extract-payment-options';

import { debtorExtractPaymentStyles as ps } from './debtor-extract-payment.styles';
import { debtorExtractRequestStyles as s } from './debtor-extract-request.styles';
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
  const methods = useMemo(() => getDebtorExtractPaymentOptions(), []);
  const feeText =
    amount != null
      ? t('debtors.detailPaidAmountValue', { amount: amount.toFixed(2) })
      : t('debtors.extractFeeAmount');
  return (
    <>
      <View style={ps.feeCard}>
        <Text style={ps.feeLabel}>{t('debtors.extractFeeTitle')}</Text>
        <Text style={ps.feeAmount}>{feeText}</Text>
      </View>
      <Text style={ps.methodsTitle}>{t('debtors.extractMethodsTitle')}</Text>
      <View style={[s.fieldGap, ps.methodsList]}>
        {methods.map((m) => {
          const isOn = selected === m.id;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isOn }}
              onPress={() => onSelect(m.id)}
              style={[
                ps.methodPress,
                isOn && ps.methodPressSelected,
                m.id === 'bankOfGeorgia' && ps.methodAccentBog,
                m.id === 'applePay' && ps.methodAccentApplePay,
              ]}
            >
              <PaymentMethodBrandIcon
                methodId={m.id}
                fallbackIcon={m.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              />
              <Text style={ps.methodLabel} numberOfLines={2}>
                {t(m.labelKey)}
              </Text>
              {isOn ? (
                <MaterialCommunityIcons name="check-circle" size={24} color={DebtorRegistryPalette.buttonBg} />
              ) : (
                <View style={ps.methodRadioOuter} />
              )}
            </Pressable>
          );
        })}
      </View>
      <View style={s.primaryButtonWrap}>
        <Button label={t('debtors.extractPayButton')} onPress={onPay} disabled={paying} />
      </View>
    </>
  );
}
