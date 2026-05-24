import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { z } from 'zod';

import { Input } from '@/components/ui/input';

import { profileScreenStyles as s } from './profile-screen.styles';

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
    <View style={s.card}>
      <Text style={s.sectionTitle}>{t('profile.sectionChangePassword')}</Text>

      <Text style={{ fontSize: 12, color: '#6b7a90', lineHeight: 18 }}>
        {t('forgotPassword.passwordRequirements')}
      </Text>

      <View style={s.fieldGroup}>
        <View style={s.fieldRow}>
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
            <Text style={s.fieldError}>{formState.errors.currentPassword.message}</Text>
          ) : null}
        </View>

        <View style={s.fieldRow}>
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
            <Text style={s.fieldError}>{formState.errors.newPassword.message}</Text>
          ) : null}
        </View>

        <View style={s.fieldRow}>
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
            <Text style={s.fieldError}>{formState.errors.confirmPassword.message}</Text>
          ) : null}
        </View>
      </View>

      {statusMessage ? (
        <Text style={[s.statusMessage, statusMessage.type === 'success' ? s.statusSuccess : s.statusError]}>
          {statusMessage.text}
        </Text>
      ) : null}

      <Pressable
        style={[s.buttonPrimary, (isSubmitting || !formState.isValid) && s.buttonDisabled]}
        onPress={() => void submitHandler()}
        disabled={isSubmitting || !formState.isValid}
        accessibilityRole="button">
        <Text style={s.buttonPrimaryText}>{t('profile.changePasswordButton')}</Text>
      </Pressable>
    </View>
  );
}
