import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppTheme } from '@/theme';
import type { ForcedPwdChangeState } from '@/types/login';

const PUNCTUATION_RE = /[~!@#$%^&*()_+`\-={}[\]|\\:";'<>,.?/]/;

function createSchema(t: ReturnType<typeof useTranslation>['t']) {
  return z
    .object({
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

type FormValues = { newPassword: string; confirmPassword: string };

export function ForcedPasswordChangeModal({ visible, isSubmitting, onSubmit }: ForcedPwdChangeState) {
  const { t, i18n } = useTranslation();
  const { colors } = useAppTheme();
  const schema = useMemo(() => createSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const submitHandler = handleSubmit(async ({ newPassword }) => {
    await onSubmit(newPassword);
  });

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16 }}
        style={{ backgroundColor: colors.overlay }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={16}>
        <View className="gap-3 rounded-md bg-surface p-4">
          <Text className="text-heading font-bold text-fg">{t('login.forcedPwdChangeTitle')}</Text>
          <Text className="text-label leading-5 text-fg-muted">
            {t('login.forcedPwdChangeSubtitle')}
          </Text>
          <Text className="text-label leading-[18px] text-fg-muted">
            {t('login.registerPasswordRequirements')}
          </Text>

          <View className="gap-2">
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
              <Text className="text-caption text-danger">
                {formState.errors.newPassword.message}
              </Text>
            ) : null}

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
              <Text className="text-caption text-danger">
                {formState.errors.confirmPassword.message}
              </Text>
            ) : null}
          </View>

          {isSubmitting ? (
            <Pressable disabled className="items-center py-3">
              <ActivityIndicator color={colors.primary} />
            </Pressable>
          ) : (
            <Button
              label={t('login.forcedPwdChangeButton')}
              onPress={() => { submitHandler(); }}
              disabled={!formState.isValid}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
