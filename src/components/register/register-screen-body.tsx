import { useState } from 'react';
import { ScrollView, View } from 'react-native';

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
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.scrollContent}
      keyboardShouldPersistTaps="handled">
      <RegisterNavRow onBack={onBack} />
      <View style={s.card}>
        <RegisterSegmentedTabs value={tab} onChange={setTab} />
        {tab === 'physical' ? (
          <RegisterPhysicalForm
            onValidSubmit={(values) => void flow.handleFormSubmit(values)}
          />
        ) : (
          <RegisterLegalForm />
        )}
      </View>
    </ScrollView>
  );
}
