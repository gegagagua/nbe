import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import BogMark from '@/assets/images/bank-of-georgia-mark.svg';
import { ApplePayBrand } from '@/constants/payment-brands';
import { useAppTheme } from '@/theme';
import type { DebtorExtractPaymentMethod } from '@/types/debtor-extract';

type Props = {
  methodId: DebtorExtractPaymentMethod;
  fallbackIcon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const WRAP = 40;

export function PaymentMethodBrandIcon({ methodId, fallbackIcon }: Props) {
  const { colors } = useAppTheme();
  if (methodId === 'applePay') {
    return (
      <View
        className="h-10 flex-row items-center justify-center gap-1 rounded-sm px-2"
        style={{ minWidth: ApplePayBrand.markMinWidth, backgroundColor: ApplePayBrand.background }}>
        <MaterialCommunityIcons name="apple" size={22} color={ApplePayBrand.onBackground} />
        <Text
          className="text-caption font-bold tracking-[0.3px]"
          style={{ color: ApplePayBrand.onBackground }}>
          Pay
        </Text>
      </View>
    );
  }
  if (methodId === 'bankOfGeorgia') {
    return (
      <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-sm">
        <BogMark width={WRAP} height={WRAP} />
      </View>
    );
  }
  return (
    <View className="h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface-sunken">
      <MaterialCommunityIcons name={fallbackIcon} size={22} color={colors.text} />
    </View>
  );
}
