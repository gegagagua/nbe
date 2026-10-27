import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PressableScale } from '@/components/ui/pressable-scale';
import { createOtpSchema, type OtpFormValues } from '@/schemas/password-reset.schema';

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
    <ScrollView
      className="w-full max-w-[420px] flex-1 self-stretch"
      contentContainerClassName="grow justify-center pb-4">
      <Card padding="lg" elevation="lg" className="w-full self-center rounded-2xl">
        <View className="gap-4">
          <Text className="text-center text-heading font-bold text-fg">
            {t('login.registerOtpTitle')}
          </Text>
          <Text className="text-center text-body text-fg-secondary">
            {t('login.registerOtpDescription')}
          </Text>

          <View className="flex-row items-center justify-center gap-1">
            <Text
              className={`text-body font-semibold ${isExpired ? 'text-danger' : 'text-primary'}`}>
              {timerLabel}
            </Text>
          </View>

          {isExpired ? (
            <Text className="text-center text-caption text-danger">
              {t('login.registerOtpExpiredMessage')}
            </Text>
          ) : null}

          <View className="gap-1">
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
                  otp
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

          <PressableScale
            haptic="none"
            pressedScale={0.98}
            onPress={onBack}
            accessibilityRole="button"
            className="items-center pt-1">
            <Text className="text-caption text-primary underline">
              {t('login.registerOtpBackButton')}
            </Text>
          </PressableScale>
        </View>
      </Card>
    </ScrollView>
  );
}
