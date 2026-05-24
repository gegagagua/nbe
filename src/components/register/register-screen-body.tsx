import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OtpStep } from '@/components/forgot-password/otp-step';
import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';
import { sendOtp, verifyOtp } from '@/api/password-reset';
import { recordPasswordChange } from '@/lib/password-history-storage';
import { showErrorToast } from '@/lib/show-error-toast';
import type { RegisterPhysicalValues, RegisterLegalValues } from '@/types/register-form-values';
import type { RegisterScreenBodyProps, RegisterTabKind } from '@/types/register';

import { RegisterNavRow } from './register-nav-row';
import { RegisterPhysicalForm } from './register-physical-form';
import { RegisterLegalForm } from './register-legal-form';
import { RegisterSegmentedTabs } from './register-segmented-tabs';
import { registerScreenBodyStyles } from './register-screen-body.styles';

type Step = 'form' | 'otp' | 'identomat' | 'success';

export function RegisterScreenBody({ onBack }: RegisterScreenBodyProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<RegisterTabKind>('physical');
  const [step, setStep] = useState<Step>('form');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const pendingValues = useRef<RegisterPhysicalValues | null>(null);

  // Step 1: form submitted — send OTP to the registered phone
  const handleFormSubmit = useCallback(async (values: RegisterPhysicalValues) => {
    pendingValues.current = values;
    setIsSendingOtp(true);
    try {
      await sendOtp(values.phone);
      setStep('otp');
    } catch {
      showErrorToast(t('forgotPassword.networkError'));
    } finally {
      setIsSendingOtp(false);
    }
  }, [t]);

  // Step 2: OTP verified — proceed to Identomat
  const handleOtpVerify = useCallback(async (code: string) => {
    const values = pendingValues.current;
    if (!values) return;
    setIsVerifyingOtp(true);
    try {
      await verifyOtp(values.phone, code);
      setStep('identomat');
    } catch {
      showErrorToast(t('validation.otpMismatch'));
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [t]);

  const handleResendOtp = useCallback(async () => {
    const values = pendingValues.current;
    if (!values) return;
    setIsSendingOtp(true);
    try {
      await sendOtp(values.phone);
    } catch {
      showErrorToast(t('forgotPassword.networkError'));
    } finally {
      setIsSendingOtp(false);
    }
  }, [t]);

  // Step 3: Identomat match confirmed → save history & success
  const handleIdentomatSuccess = useCallback(async () => {
    const values = pendingValues.current;
    if (!values) return;
    await recordPasswordChange(values.password);
    setStep('success');
  }, []);

  const handleIdentomatFail = useCallback(() => {
    showErrorToast(t('login.registerIdentomatFail'));
    setStep('form');
    pendingValues.current = null;
  }, [t]);

  if (step === 'success') {
    return (
      <ScrollView
        style={registerScreenBodyStyles.scroll}
        contentContainerStyle={[registerScreenBodyStyles.scrollContent, { justifyContent: 'center', flex: 1 }]}>
        <View style={[registerScreenBodyStyles.card, successStyles.card]}>
          <Text style={successStyles.icon}>✓</Text>
          <Text style={successStyles.title}>{t('login.registerSuccessTitle')}</Text>
          <Text style={successStyles.message}>{t('login.registerSuccessMessage')}</Text>
          <Pressable style={successStyles.button} onPress={() => router.replace('/')} accessibilityRole="button">
            <Text style={successStyles.buttonText}>{t('login.registerSuccessButton')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (step === 'identomat') {
    return (
      <ScrollView
        style={registerScreenBodyStyles.scroll}
        contentContainerStyle={registerScreenBodyStyles.scrollContent}>
        <RegisterNavRow onBack={() => setStep('otp')} />
        <View style={registerScreenBodyStyles.card}>
          <Text style={identomatStyles.title}>{t('login.registerIdentomatTitle')}</Text>
          <Text style={identomatStyles.description}>{t('login.registerIdentomatDescription')}</Text>
          <View style={identomatStyles.buttons}>
            <Pressable
              style={identomatStyles.primaryButton}
              onPress={() => void handleIdentomatSuccess()}
              accessibilityRole="button">
              <Text style={identomatStyles.primaryButtonText}>{t('login.registerIdentomatButton')}</Text>
            </Pressable>
            <Pressable
              style={identomatStyles.failButton}
              onPress={handleIdentomatFail}
              accessibilityRole="button">
              <Text style={identomatStyles.failButtonText}>{t('login.registerIdentomatFail')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (step === 'otp') {
    return (
      <ScrollView
        style={registerScreenBodyStyles.scroll}
        contentContainerStyle={registerScreenBodyStyles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <RegisterNavRow onBack={() => setStep('form')} />
        <View style={registerScreenBodyStyles.card}>
          <OtpStep
            onVerify={(code) => void handleOtpVerify(code)}
            onResend={() => void handleResendOtp()}
            isVerifying={isVerifyingOtp}
            isResending={isSendingOtp}
          />
        </View>
      </ScrollView>
    );
  }

  // step === 'form'
  return (
    <ScrollView
      style={registerScreenBodyStyles.scroll}
      contentContainerStyle={registerScreenBodyStyles.scrollContent}
      keyboardShouldPersistTaps="handled">
      <RegisterNavRow onBack={onBack} />
      <View style={registerScreenBodyStyles.card}>
        <RegisterSegmentedTabs value={tab} onChange={setTab} />
        {tab === 'physical' ? (
          <RegisterPhysicalForm
            onValidSubmit={(values) => void handleFormSubmit(values)}
          />
        ) : (
          <RegisterLegalForm />
        )}
      </View>
    </ScrollView>
  );
}

const successStyles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: Space.medium,
  },
  icon: {
    fontSize: 48,
    color: '#1a7f37',
  },
  title: {
    fontSize: Typography.extraLarge,
    fontWeight: '700',
    color: '#1a7f37',
    textAlign: 'center',
  },
  message: {
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: LoginPalette.primary,
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    paddingHorizontal: Space.extraLarge,
    marginTop: Space.small,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: Typography.medium,
    fontWeight: '700',
  },
});

const identomatStyles = StyleSheet.create({
  title: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.titleText,
    marginBottom: Space.small,
  },
  description: {
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    lineHeight: 22,
    marginBottom: Space.medium,
  },
  buttons: {
    gap: Space.small,
  },
  primaryButton: {
    backgroundColor: LoginPalette.primary,
    borderRadius: Radius.small,
    paddingVertical: Space.medium,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: Typography.medium,
    fontWeight: '700',
  },
  failButton: {
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    alignItems: 'center',
  },
  failButtonText: {
    color: LoginPalette.errorText,
    fontSize: Typography.small,
    textDecorationLine: 'underline',
  },
});
