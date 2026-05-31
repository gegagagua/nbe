import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { registerScreenBodyStyles as s } from './register-screen-body.styles';

export function RegisterSuccessStep() {
  const { t } = useTranslation();

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.scrollContentCenter}>
      <View style={[s.card, s.successCard]}>
        <Text style={s.successIcon}>✓</Text>
        <Text style={s.successTitle}>{t('login.registerSuccessTitle')}</Text>
        <Text style={s.successMessage}>{t('login.registerSuccessMessage')}</Text>
        <Pressable
          style={s.successButton}
          onPress={() => router.replace('/')}
          accessibilityRole="button">
          <Text style={s.successButtonText}>{t('login.registerSuccessButton')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
