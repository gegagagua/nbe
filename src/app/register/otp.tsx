import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { useRegisterFlowContext } from '@/components/register/register-flow-context';
import { RegisterOtpStep } from '@/components/register/register-otp-step';

export default function RegisterOtpRoute() {
  const { t } = useTranslation();
  const flow = useRegisterFlowContext();

  return (
    <LoginScreenLayout title={t('login.registrationPageTitle')} contentAlign="top">
      <RegisterOtpStep
        onVerify={flow.handleOtpVerify}
        onBack={() => router.back()}
        isVerifying={flow.isVerifyingOtp}
      />
    </LoginScreenLayout>
  );
}
