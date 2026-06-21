import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { IdentomatDemoScreen } from '@/components/identomat/identomat-demo-screen';
import { useRegisterFlow } from '@/hooks/use-register-flow';
import type { RegisterScreenBodyProps } from '@/types/register';

import { RegisterNavRow } from './register-nav-row';
import { RegisterOtpStep } from './register-otp-step';
import { RegisterPhysicalForm } from './register-physical-form';
import { registerScreenBodyStyles as s } from './register-screen-body.styles';
import { RegisterSuccessStep } from './register-success-step';

// How long the success confirmation stays up before redirecting to the auth page.
const SUCCESS_REDIRECT_MS = 2000;

export function RegisterScreenBody({ onBack }: RegisterScreenBodyProps) {
  const flow = useRegisterFlow();

  // On finish, redirect to the auth (login) page. A freshly registered user has
  // no session yet, so the auth page is the correct destination.
  useEffect(() => {
    if (flow.step !== 'success') return;
    const timer = setTimeout(() => router.replace('/'), SUCCESS_REDIRECT_MS);
    return () => clearTimeout(timer);
  }, [flow.step]);

  if (flow.step === 'success') {
    return <RegisterSuccessStep />;
  }

  if (flow.step === 'identomat' && flow.verificationUrl) {
    return (
      <IdentomatDemoScreen
        sourceUrl={flow.verificationUrl}
        onBack={flow.handleIdentomatBack}
        onSuccess={flow.handleIdentomatDone}
        isCheckingVerification={flow.isCheckingVerification}
      />
    );
  }

  if (flow.step === 'otp') {
    return (
      <RegisterOtpStep
        onVerify={flow.handleOtpVerify}
        onBack={flow.handleOtpBack}
        isVerifying={flow.isVerifyingOtp}
      />
    );
  }

  return (
    <KeyboardAwareScrollView
      style={s.scroll}
      contentContainerStyle={s.scrollContent}
      keyboardShouldPersistTaps="handled"
      bottomOffset={16}>
      <RegisterNavRow onBack={onBack} />
      <View style={s.card}>
        <RegisterPhysicalForm
          onValidSubmit={(values) => { flow.handleFormSubmit(values); }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
