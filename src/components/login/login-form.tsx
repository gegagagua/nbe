import { Controller } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { LoginFormProps } from '@/types/login';

import { LoginBrandHeader } from './login-brand-header';
import { loginFormStyles } from './login-form.styles';

export function LoginForm({
  control,
  errors,
  onSubmit,
  submitDisabled,
  onRegisterPress,
  onGuestPress,
  onIdentomatDemoPress,
}: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <View style={loginFormStyles.stack}>
      <LoginBrandHeader />
      <View style={loginFormStyles.card}>
        <View style={loginFormStyles.fields}>
          <View style={loginFormStyles.fieldRow}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t('login.usernamePlaceholder')}
                  errorMessage={errors.username?.message}
                />
              )}
            />
            {errors.username?.message ? (
              <Text style={loginFormStyles.fieldError}>
                {errors.username.message}
              </Text>
            ) : null}
          </View>
          <View style={loginFormStyles.fieldRow}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t('login.passwordPlaceholder')}
                  secureTextEntry
                  errorMessage={errors.password?.message}
                />
              )}
            />
            {errors.password?.message ? (
              <Text style={loginFormStyles.fieldError}>
                {errors.password.message}
              </Text>
            ) : null}
          </View>
        </View>
        <Button
          label={t('login.submit')}
          onPress={() => void onSubmit()}
          disabled={submitDisabled}
        />
        <Pressable
          style={loginFormStyles.registerLink}
          onPress={onRegisterPress}
          accessibilityRole="link">
          <Text style={loginFormStyles.registerLinkText}>
            {t('login.registrationLink')}
          </Text>
        </Pressable>
        <Pressable style={loginFormStyles.guestLink} onPress={onGuestPress}>
          <Text style={loginFormStyles.guestLinkText}>{t('login.guestLink')}</Text>
        </Pressable>
        <Pressable
          style={loginFormStyles.identomatDemoButton}
          onPress={onIdentomatDemoPress}
          accessibilityRole="button">
          <Text style={loginFormStyles.identomatDemoButtonLabel}>
            {t('login.identomatDemoButton')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
