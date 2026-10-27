import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  createForgotPasswordIdentitySchema,
  type ForgotPasswordIdentityValues,
} from '@/schemas/password-reset.schema';

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
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bottomOffset={16}>
      <Card padding="lg" elevation="lg" className="gap-4 rounded-2xl">
        <Text className="text-center text-heading font-bold text-fg">
          {t('forgotPassword.pageTitle')}
        </Text>
        <Text className="text-center text-body text-fg-secondary">
          {t('forgotPassword.identityDescription')}
        </Text>

        <View className="gap-1">
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
        </View>

        {statusMessage ? (
          <Text
            className={`text-center text-caption font-semibold ${
              statusMessage.type === 'success' ? 'text-success' : 'text-danger'
            }`}>
            {statusMessage.text}
          </Text>
        ) : null}

        <Button
          label={t('forgotPassword.submitButton')}
          onPress={() => { submitHandler(); }}
          disabled={isSubmitting || !formState.isValid || statusMessage?.type === 'success'}
        />
      </Card>
    </KeyboardAwareScrollView>
  );
}
