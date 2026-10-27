import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PressableScale } from '@/components/ui/pressable-scale';
import type { LoginFormProps } from '@/types/login';

import { LoginBrandHeader } from './login-brand-header';

export function LoginForm({
  control,
  errors,
  onSubmit,
  submitDisabled,
  onRegisterPress,
  onGuestPress,
  onIdentomatDemoPress,
  onForgotPasswordPress,
  faceId,
  passkey,
}: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <View className="w-full max-w-[420px] self-center">
      <LoginBrandHeader />
      <Card padding="lg" elevation="lg" className="rounded-2xl">
        <View className="mb-4 gap-4">
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                label={t('login.usernamePlaceholder')}
                placeholder={t('login.usernamePlaceholder')}
                leftIcon="account-outline"
                errorMessage={errors.username?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                label={t('login.passwordPlaceholder')}
                placeholder={t('login.passwordPlaceholder')}
                leftIcon="lock-outline"
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />
        </View>

        <Button
          label={t('login.submit')}
          onPress={() => { onSubmit(); }}
          disabled={submitDisabled}
          size="lg"
        />

        {faceId?.show ? (
          <View className="mt-2">
            <Button
              label={faceId.label}
              onPress={faceId.onPress}
              disabled={faceId.disabled}
              variant="secondary"
              leftIcon={faceId.iconName}
            />
          </View>
        ) : null}

        {passkey?.show ? (
          <View className="mt-2">
            <Button
              label={passkey.label}
              onPress={passkey.onPress}
              disabled={passkey.disabled}
              variant="secondary"
              leftIcon="key-variant"
            />
          </View>
        ) : null}

        <PressableScale
          haptic="none"
          pressedScale={0.98}
          onPress={onForgotPasswordPress}
          accessibilityRole="button"
          className="mt-5 min-h-[44px] items-center justify-center">
          <Text className="text-label font-semibold text-primary underline">
            {t('forgotPassword.pageTitle')}
          </Text>
        </PressableScale>

        <PressableScale
          haptic="none"
          pressedScale={0.98}
          onPress={onRegisterPress}
          accessibilityRole="link"
          className="mt-1 min-h-[44px] items-center justify-center">
          <Text className="text-label text-fg-muted">{t('login.registrationLink')}</Text>
        </PressableScale>

        <PressableScale
          haptic="none"
          pressedScale={0.98}
          onPress={onGuestPress}
          accessibilityRole="button"
          className="min-h-[44px] items-center justify-center">
          <Text className="text-label text-fg-muted underline">{t('login.guestLink')}</Text>
        </PressableScale>
      </Card>
    </View>
  );
}
