import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ForgotPasswordIdentityStep } from '@/components/forgot-password/forgot-password-identity-step';
import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { LoginPalette } from '@/constants/login';
import { Space, Typography } from '@/constants/theme';
import { useForgotPassword } from '@/hooks/use-forgot-password';

export default function ForgotPasswordRoute() {
  const { t } = useTranslation();
  const { statusMessage, handleSubmit, isSubmitting } = useForgotPassword();

  return (
    <LoginScreenLayout title={t('forgotPassword.pageTitle')} contentAlign="top">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('forgotPassword.backA11yLabel')}>
          <Text style={styles.backButtonText}>← {t('forgotPassword.backA11yLabel')}</Text>
        </Pressable>

        <View style={styles.content}>
          <ForgotPasswordIdentityStep
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            statusMessage={statusMessage}
          />
        </View>
      </ScrollView>
    </LoginScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Space.extraLarge,
  },
  backButton: {
    paddingVertical: Space.small,
    paddingHorizontal: Space.medium,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: LoginPalette.primary,
    fontSize: Typography.medium,
    fontWeight: '600',
  },
  content: {
    paddingTop: Space.medium,
  },
});
