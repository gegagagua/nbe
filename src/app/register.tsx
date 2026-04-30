import { router } from 'expo-router';

import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { RegisterScreenBody } from '@/components/register/register-screen-body';
import { LoginCopy } from '@/constants/login-copy';

export default function RegisterRoute() {
  return (
    <LoginScreenLayout
      title={LoginCopy.registrationPageTitle}
      contentAlign="top">
      <RegisterScreenBody onBack={() => router.back()} />
    </LoginScreenLayout>
  );
}
