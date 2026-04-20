import { ActivityIndicator } from 'react-native';

import { LoginForm } from '@/components/login/login-form';
import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { LoginPalette } from '@/constants/login';
import { LoginCopy } from '@/constants/login-copy';
import { useLoginForm } from '@/hooks/use-login-form';
import { useLoginIndexSessionRedirect } from '@/hooks/use-session-navigation';

function LoginScreenContent() {
  const login = useLoginForm();

  return (
    <LoginScreenLayout>
      <LoginForm
        control={login.control}
        errors={login.errors}
        onSubmit={login.onSubmit}
        submitDisabled={login.submitDisabled}
      />
    </LoginScreenLayout>
  );
}

export default function LoginRoute() {
  const canShowLogin = useLoginIndexSessionRedirect();

  if (!canShowLogin) {
    return (
      <LoginScreenLayout>
        <ActivityIndicator
          size="large"
          color={LoginPalette.primary}
          accessibilityLabel={LoginCopy.sessionBootLoadingA11yLabel}
        />
      </LoginScreenLayout>
    );
  }

  return <LoginScreenContent />;
}
