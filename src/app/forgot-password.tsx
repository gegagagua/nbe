import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { NewPasswordStep } from '@/components/forgot-password/new-password-step';
import { OtpStep } from '@/components/forgot-password/otp-step';
import { PhoneStep } from '@/components/forgot-password/phone-step';
import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { LoginPalette } from '@/constants/login';
import { Space, Typography } from '@/constants/theme';
import { useForgotPassword } from '@/hooks/use-forgot-password';

export default function ForgotPasswordRoute() {
  const { t } = useTranslation();
  const {
    step,
    statusMessage,
    handlePhoneSubmit,
    handleOtpVerify,
    handleResendOtp,
    handleNewPasswordSubmit,
    isSendingOtp,
    isVerifyingOtp,
    isResettingPassword,
  } = useForgotPassword();

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
          {step === 'phone' && (
            <PhoneStep onSubmit={handlePhoneSubmit} isSubmitting={isSendingOtp} />
          )}
          {step === 'otp' && (
            <OtpStep
              onVerify={handleOtpVerify}
              onResend={handleResendOtp}
              isVerifying={isVerifyingOtp}
              isResending={isSendingOtp}
            />
          )}
          {step === 'newPassword' && (
            <NewPasswordStep
              onSubmit={(pw) => void handleNewPasswordSubmit(pw)}
              isSubmitting={isResettingPassword}
              statusMessage={statusMessage}
            />
          )}
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
    paddingHorizontal: Space.medium,
    paddingTop: Space.medium,
  },
});
