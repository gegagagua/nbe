import { Redirect, router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { IdentomatDemoScreen } from '@/components/identomat/identomat-demo-screen';
import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { useRegisterFlowContext } from '@/components/register/register-flow-context';

export default function RegisterIdentomatRoute() {
  const { t } = useTranslation();
  const flow = useRegisterFlowContext();

  // The Identomat step is only reachable once OTP verification returns a
  // verification URL; guard against landing here without one (e.g. a reload).
  if (!flow.verificationUrl) {
    return <Redirect href="/register/otp" />;
  }

  return (
    <LoginScreenLayout title={t('login.registrationPageTitle')} contentAlign="top">
      <IdentomatDemoScreen
        sourceUrl={flow.verificationUrl}
        onBack={() => router.back()}
        onSuccess={flow.handleIdentomatDone}
        isCheckingVerification={flow.isCheckingVerification}
      />
    </LoginScreenLayout>
  );
}
