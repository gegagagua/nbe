import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';
import { createOtpSchema, type OtpFormValues } from '@/schemas/password-reset.schema';
import type { OtpLoginState } from '@/types/login';

const OTP_TTL_SECONDS = 180;

type Props = OtpLoginState & {
  /** Override the login-specific copy when reused elsewhere (e.g. phone change). */
  title?: string;
  description?: string;
  cancelLabel?: string;
};

export function LoginOtpModal({
  visible,
  isSubmitting,
  onSubmit,
  onCancel,
  title,
  description,
  cancelLabel,
}: Props) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createOtpSchema(t), [t, i18n.language]);
  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { control, handleSubmit, formState, reset } = useForm<OtpFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { code: '' },
  });

  useEffect(() => {
    if (!visible) return;
    setSecondsLeft(OTP_TTL_SECONDS);
    reset({ code: '' });
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, reset]);

  const isExpired = secondsLeft === 0;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerLabel = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const submitHandler = useMemo(
    () => handleSubmit(async ({ code }) => { await onSubmit(code); }),
    [handleSubmit, onSubmit],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', paddingHorizontal: Space.large }}>
        <View style={{ backgroundColor: '#fff', borderRadius: Radius.medium, padding: Space.large, gap: Space.medium }}>
          <Text style={{ fontSize: Typography.large, fontWeight: '700', color: LoginPalette.bodyText }}>
            {title ?? t('login.otpLoginTitle')}
          </Text>
          <Text style={{ fontSize: Typography.small, color: LoginPalette.placeholderMuted, lineHeight: 20 }}>
            {description ?? t('login.otpLoginDescription')}
          </Text>

          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: Typography.large,
              fontWeight: '600',
              color: isExpired ? LoginPalette.errorText : LoginPalette.primary,
            }}>
              {timerLabel}
            </Text>
          </View>

          {isExpired ? (
            <Text style={{ fontSize: Typography.small, color: LoginPalette.errorText, textAlign: 'center' }}>
              {t('login.otpLoginExpiredMessage')}
            </Text>
          ) : null}

          <View style={{ gap: Space.small }}>
            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t('login.otpLoginPlaceholder')}
                  keyboardType="number-pad"
                  errorMessage={formState.errors.code?.message}
                />
              )}
            />
            {formState.errors.code?.message ? (
              <Text style={{ fontSize: Typography.extraSmall, color: LoginPalette.errorText }}>
                {formState.errors.code.message}
              </Text>
            ) : null}
          </View>

          {isSubmitting ? (
            <View style={{ alignItems: 'center', paddingVertical: Space.medium }}>
              <ActivityIndicator color={LoginPalette.primary} />
            </View>
          ) : (
            <Button
              label={t('login.otpLoginVerifyButton')}
              onPress={() => { submitHandler(); }}
              disabled={!formState.isValid || isExpired}
            />
          )}

          <Pressable
            style={{ alignItems: 'center', paddingVertical: Space.small }}
            onPress={onCancel}
            accessibilityRole="button">
            <Text style={{ fontSize: Typography.small, color: LoginPalette.primary }}>
              {cancelLabel ?? t('login.otpLoginBackButton')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
