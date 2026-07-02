import { router } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { RegisterSuccessStep } from '@/components/register/register-success-step';

// How long the success confirmation stays up before redirecting to the auth page.
const SUCCESS_REDIRECT_MS = 2000;

export default function RegisterSuccessRoute() {
  const { t } = useTranslation();

  // A freshly registered user has no session yet, so the auth page is the
  // correct destination.
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/'), SUCCESS_REDIRECT_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoginScreenLayout title={t('login.registrationPageTitle')} contentAlign="top">
      <RegisterSuccessStep />
    </LoginScreenLayout>
  );
}
