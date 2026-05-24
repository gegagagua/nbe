import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LoginForm } from '@/components/login/login-form';
import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { LoginPalette } from '@/constants/login';
import { useLoginForm } from '@/hooks/use-login-form';
import { useLoginIndexSessionRedirect } from '@/hooks/use-session-navigation';
import { setGuestMode } from '@/lib/guest-mode';

function LoginScreenContent() {
  const login = useLoginForm();

  function handleGuestPress() {
    setGuestMode(true);
    router.replace('/dashboard');
  }

  function handleRegisterPress() {
    router.push('/register');
  }

  function handleIdentomatDemoPress() {
    router.push('/identomat-demo?mode=guest');
  }

  function handleForgotPasswordPress() {
    router.push('/forgot-password');
  }

  return (
    <LoginScreenLayout>
      <LoginForm
        control={login.control}
        errors={login.errors}
        onSubmit={login.onSubmit}
        submitDisabled={login.submitDisabled}
        onRegisterPress={handleRegisterPress}
        onGuestPress={handleGuestPress}
        onIdentomatDemoPress={handleIdentomatDemoPress}
        onForgotPasswordPress={handleForgotPasswordPress}
      />
    </LoginScreenLayout>
  );
}

export default function LoginRoute() {
  const { t } = useTranslation();
  const canShowLogin = useLoginIndexSessionRedirect();

  if (!canShowLogin) {
    return (
      <LoginScreenLayout>
        <ActivityIndicator
          size="large"
          color={LoginPalette.primary}
          accessibilityLabel={t('login.sessionBootLoadingA11yLabel')}
        />
      </LoginScreenLayout>
    );
  }

  return <LoginScreenContent />;
}
