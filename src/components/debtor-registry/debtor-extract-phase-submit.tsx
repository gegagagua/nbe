import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ToastLayout } from '@/constants/toast';
import type {
  DebtorExtractPaymentMethod,
  DebtorExtractPaymentOptionLabelKey,
} from '@/types/debtor-extract';

const PAYMENT_METHOD_LABEL: Record<DebtorExtractPaymentMethod, DebtorExtractPaymentOptionLabelKey> =
  {
    applePay: 'debtors.extractMethodApplePay',
    googlePay: 'debtors.extractMethodGooglePay',
    bankTransfer: 'debtors.extractMethodBankTransfer',
    bankOfGeorgia: 'debtors.extractMethodBankOfGeorgia',
  };

type Props = {
  applicationNumber: string;
  paymentMethod: DebtorExtractPaymentMethod;
  onSent: () => void;
};

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
      <Card className="gap-4 bg-surface-sunken">
        <View className="gap-1">
          <Text className="text-label font-semibold text-fg-secondary">
            {t('debtors.extractPaymentStatusLabel')}
          </Text>
          <Text className="text-body font-bold text-fg">
            {t('debtors.extractPaymentStatusPaid')}
          </Text>
        </View>
        <View className="gap-1">
          <Text className="text-label font-semibold text-fg-secondary">
            {t('debtors.extractApplicationNoLabel')}
          </Text>
          <Text className="text-body font-bold text-fg">{applicationNumber}</Text>
        </View>
        <View className="gap-1">
          <Text className="text-label font-semibold text-fg-secondary">
            {t('debtors.extractMethodsTitle')}
          </Text>
          <Text className="text-body font-bold text-fg">
            {t(PAYMENT_METHOD_LABEL[paymentMethod])}
          </Text>
        </View>
      </Card>
      <Text className="text-caption text-fg-muted">{t('debtors.extractSubmitHint')}</Text>
      <Button label={t('debtors.extractSubmitButton')} onPress={onSubmit} />
    </>
  );
}
