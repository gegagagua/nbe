import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createOtpSchema, type OtpFormValues } from '@/schemas/password-reset.schema';

import { registerOtpStepStyles as os } from './register-otp-step.styles';
import { registerScreenBodyStyles as s } from './register-screen-body.styles';

const OTP_TTL_SECONDS = 180;

type RegisterOtpStepProps = {
  onVerify: (code: string) => void;
  onBack: () => void;
  isVerifying: boolean;
};

export function RegisterOtpStep({ onVerify, onBack, isVerifying }: RegisterOtpStepProps) {
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

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerLabel = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const onSubmit = useMemo(
    () => handleSubmit((values) => onVerify(values.code)),
    [handleSubmit, onVerify],
  );

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.scrollContentCenter}>
      <View style={os.card}>
        <Text style={os.title}>{t('login.registerOtpTitle')}</Text>
        <Text style={os.description}>{t('login.registerOtpDescription')}</Text>

        <View style={os.timerRow}>
          <Text style={[os.timerText, isExpired && os.timerExpired]}>{timerLabel}</Text>
        </View>

        {isExpired ? (
          <Text style={os.expiredMessage}>{t('login.registerOtpExpiredMessage')}</Text>
        ) : null}

        <View style={os.fieldRow}>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('login.registerOtpPlaceholder')}
                keyboardType="number-pad"
                errorMessage={formState.errors.code?.message}
              />
            )}
          />
        </View>

        <Button
          label={t('login.registerOtpVerifyButton')}
          onPress={() => { onSubmit(); }}
          disabled={isVerifying || !formState.isValid || isExpired}
        />

        <Pressable style={os.backButton} onPress={onBack} accessibilityRole="button">
          <Text style={os.backButtonText}>{t('login.registerOtpBackButton')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
