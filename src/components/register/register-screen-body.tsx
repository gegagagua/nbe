import { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { IdentomatDemoScreen } from '@/components/identomat/identomat-demo-screen';
import { useRegisterFlow } from '@/hooks/use-register-flow';
import type { RegisterScreenBodyProps, RegisterTabKind } from '@/types/register';

import { RegisterLegalForm } from './register-legal-form';
import { RegisterNavRow } from './register-nav-row';
import { RegisterOtpStep } from './register-otp-step';
import { RegisterPhysicalForm } from './register-physical-form';
import { RegisterSegmentedTabs } from './register-segmented-tabs';
import { RegisterSuccessStep } from './register-success-step';
import { registerScreenBodyStyles as s } from './register-screen-body.styles';

export function RegisterScreenBody({ onBack }: RegisterScreenBodyProps) {
  const [tab, setTab] = useState<RegisterTabKind>('physical');
  const flow = useRegisterFlow();

  if (flow.step === 'success') {
    return <RegisterSuccessStep />;
  }

  if (flow.step === 'identomat' && flow.verificationUrl) {
    return (
      <IdentomatDemoScreen
        sourceUrl={flow.verificationUrl}
        onBack={flow.handleIdentomatDone}
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
        <RegisterSegmentedTabs value={tab} onChange={setTab} />
        {tab === 'physical' ? (
          <RegisterPhysicalForm
            onValidSubmit={(values) => { flow.handleFormSubmit(values); }}
          />
        ) : (
          <RegisterLegalForm />
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
