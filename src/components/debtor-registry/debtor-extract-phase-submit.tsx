import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { ToastLayout } from '@/constants/toast';
import type { DebtorExtractPaymentMethod } from '@/types/debtor-extract';

import { debtorExtractPaymentStyles as ps } from './debtor-extract-payment.styles';
import { debtorExtractRequestStyles as s } from './debtor-extract-request.styles';

type Props = {
  applicationNumber: string;
  paymentMethod: DebtorExtractPaymentMethod;
  onSent: () => void;
};

function methodLabelKey(m: DebtorExtractPaymentMethod): 'debtors.extractMethodCard' | 'debtors.extractMethodBank' | 'debtors.extractMethodApple' {
  if (m === 'bank') return 'debtors.extractMethodBank';
  if (m === 'apple') return 'debtors.extractMethodApple';
  return 'debtors.extractMethodCard';
}

export function DebtorExtractPhaseSubmit({ applicationNumber, paymentMethod, onSent }: Props) {
  const { t } = useTranslation();
  const onSubmit = () => {
    Toast.show({
      type: 'info',
      text1: t('debtors.extractSubmitToast'),
      visibilityTime: ToastLayout.visibilityMs,
      position: 'top',
    });
    onSent();
  };
  return (
    <>
      <View style={ps.summaryCard}>
        <View style={ps.summaryRow}>
          <Text style={ps.summaryLabel}>{t('debtors.extractPaymentStatusLabel')}</Text>
          <Text style={ps.summaryValue}>{t('debtors.extractPaymentStatusPaid')}</Text>
        </View>
        <View style={ps.summaryRow}>
          <Text style={ps.summaryLabel}>{t('debtors.extractApplicationNoLabel')}</Text>
          <Text style={ps.summaryValue}>{applicationNumber}</Text>
        </View>
        <View style={ps.summaryRow}>
          <Text style={ps.summaryLabel}>{t('debtors.extractMethodsTitle')}</Text>
          <Text style={ps.summaryValue}>{t(methodLabelKey(paymentMethod))}</Text>
        </View>
      </View>
      <Text style={s.hintText}>{t('debtors.extractSubmitHint')}</Text>
      <View style={s.primaryButtonWrap}>
        <Button label={t('debtors.extractSubmitButton')} onPress={onSubmit} />
      </View>
    </>
  );
}
