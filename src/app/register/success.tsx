import { useTranslation } from 'react-i18next';

import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { useRegisterFlowContext } from '@/components/register/register-flow-context';
import { RegisterSuccessStep } from '@/components/register/register-success-step';

export default function RegisterSuccessRoute() {
  const { t } = useTranslation();
  const { verificationResult } = useRegisterFlowContext();

  // No auto-redirect here: the verification result is shown so the user can
  // read it, then they continue to the auth page via the button on the step.
  return (
    <LoginScreenLayout title={t('login.registrationPageTitle')} contentAlign="top">
      <RegisterSuccessStep result={verificationResult} />
    </LoginScreenLayout>
  );
}
