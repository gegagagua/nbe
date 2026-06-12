import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createForgotPasswordIdentitySchema,
  type ForgotPasswordIdentityValues,
} from '@/schemas/password-reset.schema';

import { forgotPasswordIdentityStepStyles as s } from './forgot-password-identity-step.styles';

type Props = {
  onSubmit: (username: string) => void;
  isSubmitting: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
};

export function ForgotPasswordIdentityStep({ onSubmit, isSubmitting, statusMessage }: Props) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createForgotPasswordIdentitySchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState } = useForm<ForgotPasswordIdentityValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { username: '' },
  });

  const submitHandler = useMemo(
    () => handleSubmit((values) => onSubmit(values.username)),
    [handleSubmit, onSubmit],
  );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={s.card}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bottomOffset={16}>
      <Text style={s.title}>{t('forgotPassword.pageTitle')}</Text>
      <Text style={s.description}>{t('forgotPassword.identityDescription')}</Text>

      <View style={s.fieldRow}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('forgotPassword.identityPlaceholder')}
              autoCapitalize="none"
              errorMessage={formState.errors.username?.message}
            />
          )}
        />
        {formState.errors.username?.message ? (
          <Text style={s.fieldError}>{formState.errors.username.message}</Text>
        ) : null}
      </View>

      {statusMessage ? (
        <Text
          style={[
            s.statusMessage,
            statusMessage.type === 'success' ? s.statusSuccess : s.statusError,
          ]}>
          {statusMessage.text}
        </Text>
      ) : null}

      <Button
        label={t('forgotPassword.submitButton')}
        onPress={() => { submitHandler(); }}
        disabled={isSubmitting || !formState.isValid || statusMessage?.type === 'success'}
      />
    </KeyboardAwareScrollView>
  );
}
