import { Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { ToastLayout } from '@/constants/toast';

import { debtorRegistryExtractCtaStyles as s } from './debtor-registry-extract-cta.styles';

export function DebtorRegistryExtractCta() {
  const { t } = useTranslation();
  return (
    <View style={s.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('debtors.extractRequestButton')}
        style={({ pressed }) => [s.press, pressed && s.pressPressed]}
        onPress={() =>
          Toast.show({
            type: 'info',
            text1: t('debtors.extractRequestSoonToast'),
            visibilityTime: ToastLayout.visibilityMs,
            position: 'top',
          })
        }>
        <Text style={s.label}>{t('debtors.extractRequestButton')}</Text>
      </Pressable>
    </View>
  );
}
