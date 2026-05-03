import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { DebtorRegistryLayout, DebtorRegistryPalette } from '@/constants/debtor-registry';
import type { DebtorExtractPaymentMethod } from '@/types/debtor-extract';

import { debtorExtractPaymentStyles as ps } from './debtor-extract-payment.styles';
import { debtorExtractRequestStyles as s } from './debtor-extract-request.styles';

const METHODS: { id: DebtorExtractPaymentMethod; labelKey: 'debtors.extractMethodCard' | 'debtors.extractMethodBank' | 'debtors.extractMethodApple'; icon: 'credit-card-outline' | 'bank-outline' | 'apple' }[] = [
  { id: 'card', labelKey: 'debtors.extractMethodCard', icon: 'credit-card-outline' },
  { id: 'bank', labelKey: 'debtors.extractMethodBank', icon: 'bank-outline' },
  { id: 'apple', labelKey: 'debtors.extractMethodApple', icon: 'apple' },
];

type Props = {
  selected: DebtorExtractPaymentMethod;
  onSelect: (m: DebtorExtractPaymentMethod) => void;
  onPay: () => void;
};

export function DebtorExtractPhasePayment({ selected, onSelect, onPay }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <View style={ps.feeCard}>
        <Text style={ps.feeLabel}>{t('debtors.extractFeeTitle')}</Text>
        <Text style={ps.feeAmount}>{t('debtors.extractFeeAmount')}</Text>
      </View>
      <Text style={ps.methodsTitle}>{t('debtors.extractMethodsTitle')}</Text>
      <View style={s.fieldGap}>
        {METHODS.map((m) => {
          const isOn = selected === m.id;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isOn }}
              onPress={() => onSelect(m.id)}
              style={[ps.methodPress, isOn && ps.methodPressSelected]}
            >
              <MaterialCommunityIcons
                name={m.icon}
                size={DebtorRegistryLayout.filterPanelIconSize}
                color={DebtorRegistryPalette.textPrimary}
              />
              <Text style={ps.methodLabel}>{t(m.labelKey)}</Text>
              {isOn ? (
                <MaterialCommunityIcons name="check-circle" size={22} color={DebtorRegistryPalette.buttonBg} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
      <View style={s.primaryButtonWrap}>
        <Button label={t('debtors.extractPayButton')} onPress={onPay} />
      </View>
    </>
  );
}
