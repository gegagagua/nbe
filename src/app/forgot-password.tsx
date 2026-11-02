import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ForgotPasswordIdentityStep } from '@/components/forgot-password/forgot-password-identity-step';
import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { PressableScale } from '@/components/ui/pressable-scale';
import { useForgotPassword } from '@/hooks/use-forgot-password';
import { useAppTheme } from '@/theme';

export default function ForgotPasswordRoute() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { statusMessage, handleSubmit, isSubmitting } = useForgotPassword();

  return (
    <LoginScreenLayout title={t('forgotPassword.pageTitle')} contentAlign="top">
      <View className="grow">
        <PressableScale
          haptic="none"
          pressedScale={0.98}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('forgotPassword.backA11yLabel')}
          className="flex-row items-center gap-1 self-start py-2 pr-4">
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.primary} />
          <Text className="text-body font-semibold text-primary">
            {t('forgotPassword.backA11yLabel')}
          </Text>
        </PressableScale>

        <View className="pt-4">
          <ForgotPasswordIdentityStep
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            statusMessage={statusMessage}
          />
        </View>
      </View>
    </LoginScreenLayout>
  );
}
