import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';

import { LoginCopy } from '@/constants/login-copy';
import type { LoginFormProps } from '@/types/login';

import { LoginBrandHeader } from './login-brand-header';
import { LoginPrimaryButton } from './login-primary-button';
import { LoginTextField } from './login-text-field';
import { loginFormStyles } from './login-form.styles';

export function LoginForm({ control, errors, onSubmit, submitDisabled }: LoginFormProps) {
  return (
    <View style={loginFormStyles.card}>
      <LoginBrandHeader />
      <View style={loginFormStyles.fields}>
        <View style={loginFormStyles.fieldRow}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <LoginTextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={LoginCopy.usernamePlaceholder}
                errorMessage={errors.username?.message}
              />
            )}
          />
          {errors.username?.message ? (
            <Text style={loginFormStyles.fieldError}>{errors.username.message}</Text>
          ) : null}
        </View>
        <View style={loginFormStyles.fieldRow}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <LoginTextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={LoginCopy.passwordPlaceholder}
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />
          {errors.password?.message ? (
            <Text style={loginFormStyles.fieldError}>{errors.password.message}</Text>
          ) : null}
        </View>
      </View>
      <LoginPrimaryButton
        label={LoginCopy.submit}
        onPress={() => void onSubmit()}
        disabled={submitDisabled}
      />
    </View>
  );
}
