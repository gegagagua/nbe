import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const PUNCTUATION_RE = /[~!@#$%^&*()_+`\-={}[\]|\\:";'<>,.?/]/;

type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type StatusMessage = { type: 'success' | 'error'; text: string };

type Props = {
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
  isSubmitting: boolean;
  statusMessage: StatusMessage | null;
};

function createSchema(t: ReturnType<typeof useTranslation>['t']) {
  return z
    .object({
      currentPassword: z.string().min(1, t('validation.requiredPassword')),
      newPassword: z
        .string()
        .min(8, t('validation.passwordTooShort'))
        .refine((v) => /[A-Z]/.test(v), t('validation.passwordNoUppercase'))
        .refine((v) => /[a-z]/.test(v), t('validation.passwordNoLowercase'))
        .refine((v) => /[0-9]/.test(v), t('validation.passwordNoDigit'))
        .refine((v) => PUNCTUATION_RE.test(v), t('validation.passwordNoPunctuation')),
      confirmPassword: z.string().min(1, t('validation.requiredConfirmPassword')),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    });
}

export function ProfileChangePasswordSection({ onSubmit, isSubmitting, statusMessage }: Props) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState, reset } = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values.currentPassword, values.newPassword);
    if (!statusMessage || statusMessage.type === 'success') {
      reset();
    }
  });

  return (
    <Card padding="lg" elevation="sm" className="gap-4 rounded-2xl">
      <Text className="text-heading font-bold text-fg">{t('profile.sectionChangePassword')}</Text>

      <Text className="text-caption leading-[18px] text-fg-muted">
        {t('forgotPassword.passwordRequirements')}
      </Text>

      <View className="gap-2">
        <View className="gap-1">
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('profile.currentPasswordPlaceholder')}
                secureTextEntry
                errorMessage={formState.errors.currentPassword?.message}
              />
            )}
          />
          {formState.errors.currentPassword?.message ? (
            <Text className="text-label text-danger">{formState.errors.currentPassword.message}</Text>
          ) : null}
        </View>

        <View className="gap-1">
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('profile.newPasswordPlaceholder')}
                secureTextEntry
                errorMessage={formState.errors.newPassword?.message}
              />
            )}
          />
          {formState.errors.newPassword?.message ? (
            <Text className="text-label text-danger">{formState.errors.newPassword.message}</Text>
          ) : null}
        </View>

        <View className="gap-1">
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('profile.confirmPasswordPlaceholder')}
                secureTextEntry
                errorMessage={formState.errors.confirmPassword?.message}
              />
            )}
          />
          {formState.errors.confirmPassword?.message ? (
            <Text className="text-label text-danger">{formState.errors.confirmPassword.message}</Text>
          ) : null}
        </View>
      </View>

      {statusMessage ? (
        <Text
          className={`text-center text-label font-semibold ${
            statusMessage.type === 'success' ? 'text-success' : 'text-danger'
          }`}>
          {statusMessage.text}
        </Text>
      ) : null}

      <Button
        label={t('profile.changePasswordButton')}
        onPress={() => { submitHandler(); }}
        disabled={isSubmitting || !formState.isValid}
      />
    </Card>
  );
}
