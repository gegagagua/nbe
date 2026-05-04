import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import BogMark from '@/assets/images/bank-of-georgia-mark.svg';
import { DebtorRegistryLayout, DebtorRegistryPalette } from '@/constants/debtor-registry';
import { ApplePayBrand } from '@/constants/payment-brands';
import type { DebtorExtractPaymentMethod } from '@/types/debtor-extract';

import { debtorExtractPaymentStyles as ps } from './debtor-extract-payment.styles';

type Props = {
  methodId: DebtorExtractPaymentMethod;
  fallbackIcon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function PaymentMethodBrandIcon({ methodId, fallbackIcon }: Props) {
  const wrap = DebtorRegistryLayout.paymentMethodIconWrap;
  if (methodId === 'applePay') {
    return (
      <View style={ps.methodIconApplePay}>
        <MaterialCommunityIcons name="apple" size={22} color={ApplePayBrand.onBackground} />
        <Text style={ps.methodIconApplePayLabel}>Pay</Text>
      </View>
    );
  }
  if (methodId === 'bankOfGeorgia') {
    return (
      <View style={[ps.methodIconWrap, ps.methodIconBog]}>
        <BogMark width={wrap} height={wrap} />
      </View>
    );
  }
  return (
    <View style={ps.methodIconWrap}>
      <MaterialCommunityIcons
        name={fallbackIcon}
        size={DebtorRegistryLayout.filterPanelIconSize}
        color={DebtorRegistryPalette.textPrimary}
      />
    </View>
  );
}
