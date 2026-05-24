import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createNewPasswordSchema, type NewPasswordFormValues } from '@/schemas/password-reset.schema';

import { newPasswordStepStyles } from './new-password-step.styles';

type NewPasswordStepProps = {
  onSubmit: (password: string) => void;
  isSubmitting: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
};

export function NewPasswordStep({ onSubmit, isSubmitting, statusMessage }: NewPasswordStepProps) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createNewPasswordSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  const submitHandler = useMemo(
    () =>
      handleSubmit((values) => {
        onSubmit(values.password);
      }),
    [handleSubmit, onSubmit],
  );

  return (
    <View style={newPasswordStepStyles.card}>
      <Text style={newPasswordStepStyles.title}>{t('forgotPassword.newPasswordTitle')}</Text>
      <Text style={newPasswordStepStyles.requirementsText}>
        {t('forgotPassword.passwordRequirements')}
      </Text>

      <View style={newPasswordStepStyles.fields}>
        <View style={newPasswordStepStyles.fieldRow}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('forgotPassword.newPasswordPlaceholder')}
                secureTextEntry
                errorMessage={formState.errors.password?.message}
              />
            )}
          />
          {formState.errors.password?.message ? (
            <Text style={newPasswordStepStyles.fieldError}>
              {formState.errors.password.message}
            </Text>
          ) : null}
        </View>

        <View style={newPasswordStepStyles.fieldRow}>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('forgotPassword.confirmPasswordPlaceholder')}
                secureTextEntry
                errorMessage={formState.errors.confirmPassword?.message}
              />
            )}
          />
          {formState.errors.confirmPassword?.message ? (
            <Text style={newPasswordStepStyles.fieldError}>
              {formState.errors.confirmPassword.message}
            </Text>
          ) : null}
        </View>
      </View>

      {statusMessage ? (
        <Text
          style={
            statusMessage.type === 'success'
              ? newPasswordStepStyles.successMessage
              : newPasswordStepStyles.errorMessage
          }>
          {statusMessage.text}
        </Text>
      ) : null}

      <Button
        label={t('forgotPassword.resetPasswordButton')}
        onPress={() => void submitHandler()}
        disabled={isSubmitting || !formState.isValid}
      />
    </View>
  );
}
