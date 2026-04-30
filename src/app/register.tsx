import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { RegisterScreenBody } from '@/components/register/register-screen-body';

export default function RegisterRoute() {
  const { t } = useTranslation();

  return (
    <LoginScreenLayout title={t('login.registrationPageTitle')} contentAlign="top">
      <RegisterScreenBody onBack={() => router.back()} />
    </LoginScreenLayout>
  );
}
