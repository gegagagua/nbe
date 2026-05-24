import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPhoneSchema, type PhoneFormValues } from '@/schemas/password-reset.schema';

import { phoneStepStyles } from './phone-step.styles';

type PhoneStepProps = {
  onSubmit: (phone: string) => void;
  isSubmitting: boolean;
};

export function PhoneStep({ onSubmit, isSubmitting }: PhoneStepProps) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createPhoneSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState } = useForm<PhoneFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { phone: '' },
  });

  const submitHandler = useMemo(
    () =>
      handleSubmit((values) => {
        onSubmit(values.phone);
      }),
    [handleSubmit, onSubmit],
  );

  return (
    <View style={phoneStepStyles.card}>
      <Text style={phoneStepStyles.title}>{t('forgotPassword.pageTitle')}</Text>

      <View style={phoneStepStyles.fieldRow}>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('forgotPassword.phonePlaceholder')}
              keyboardType="phone-pad"
              errorMessage={formState.errors.phone?.message}
            />
          )}
        />
        {formState.errors.phone?.message ? (
          <Text style={phoneStepStyles.fieldError}>{formState.errors.phone.message}</Text>
        ) : null}
      </View>

      <Button
        label={t('forgotPassword.sendOtpButton')}
        onPress={() => void submitHandler()}
        disabled={isSubmitting || !formState.isValid}
      />
    </View>
  );
}
