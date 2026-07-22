import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { debtorRegistryExtractCtaStyles as s } from './debtor-registry-extract-cta.styles';

export function DebtorRegistryExtractCta() {
  const { t } = useTranslation();
  return (
    <View style={s.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('debtors.extractRequestButton')}
        style={({ pressed }) => [s.press, pressed && s.pressPressed]}
        onPress={() => router.push('/debtors/extract-request')}
      >
        <Text style={s.label}>{t('debtors.extractRequestButton')}</Text>
      </Pressable>
    </View>
  );
}
