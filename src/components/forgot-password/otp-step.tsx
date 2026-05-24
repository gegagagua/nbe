import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createOtpSchema, type OtpFormValues } from '@/schemas/password-reset.schema';

import { otpStepStyles } from './otp-step.styles';

const OTP_TTL_SECONDS = 180;

type OtpStepProps = {
  onVerify: (code: string) => void;
  onResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
};

export function OtpStep({ onVerify, onResend, isVerifying, isResending }: OtpStepProps) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createOtpSchema(t), [t, i18n.language]);
  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { control, handleSubmit, formState } = useForm<OtpFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { code: '' },
  });

  useEffect(() => {
    setSecondsLeft(OTP_TTL_SECONDS);
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
  }, []);

  const isExpired = secondsLeft === 0;

  function handleResend() {
    setSecondsLeft(OTP_TTL_SECONDS);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    onResend();
  }

  const onSubmit = useMemo(
    () =>
      handleSubmit((values) => {
        onVerify(values.code);
      }),
    [handleSubmit, onVerify],
  );

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerLabel = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <View style={otpStepStyles.card}>
      <Text style={otpStepStyles.title}>{t('forgotPassword.otpTitle')}</Text>
      <Text style={otpStepStyles.description}>{t('forgotPassword.otpDescription')}</Text>

      <View style={otpStepStyles.timerRow}>
        <Text style={[otpStepStyles.timerText, isExpired && otpStepStyles.timerExpired]}>
          {timerLabel}
        </Text>
      </View>

      {isExpired ? (
        <Text style={otpStepStyles.expiredMessage}>{t('forgotPassword.otpExpiredMessage')}</Text>
      ) : null}

      <View style={otpStepStyles.fieldRow}>
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('forgotPassword.otpPlaceholder')}
              keyboardType="number-pad"
              errorMessage={formState.errors.code?.message}
            />
          )}
        />
        {formState.errors.code?.message ? (
          <Text style={otpStepStyles.fieldError}>{formState.errors.code.message}</Text>
        ) : null}
      </View>

      <Button
        label={t('forgotPassword.verifyOtpButton')}
        onPress={() => void onSubmit()}
        disabled={isVerifying || !formState.isValid || isExpired}
      />

      <Pressable
        style={[otpStepStyles.resendButton, isResending && otpStepStyles.resendButtonDisabled]}
        onPress={handleResend}
        disabled={isResending}
        accessibilityRole="button">
        <Text style={otpStepStyles.resendButtonText}>{t('forgotPassword.resendOtpButton')}</Text>
      </Pressable>
    </View>
  );
}
