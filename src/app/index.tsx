import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

import { ForcedPasswordChangeModal } from '@/components/login/forced-password-change-modal';
import { LoginForm } from '@/components/login/login-form';
import { LoginOtpModal } from '@/components/login/login-otp-modal';
import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { PasswordResetNoticeModal } from '@/components/login/password-reset-notice-modal';
import { LoginPalette } from '@/constants/login';
import { useFaceId } from '@/hooks/use-face-id';
import { useLoginForm } from '@/hooks/use-login-form';
import { useLoginIndexSessionRedirect } from '@/hooks/use-session-navigation';
import { setGuestMode } from '@/lib/guest-mode';
import { isInvalidCredentialsError } from '@/lib/is-invalid-credentials-error';
import { resetStackTo } from '@/lib/reset-navigation';
import { showErrorToast } from '@/lib/show-error-toast';

function LoginScreenContent() {
  const { t } = useTranslation();
  const login = useLoginForm();
  const faceId = useFaceId();
  const [isFaceIdLoading, setIsFaceIdLoading] = useState(false);

  const { passwordReset } = useLocalSearchParams<{ passwordReset?: string }>();
  const [showPasswordResetNotice, setShowPasswordResetNotice] = useState(false);

  useEffect(() => {
    if (passwordReset === 'requested') {
      setShowPasswordResetNotice(true);
      // Clear the query param so the notice doesn't reappear on re-focus.
      router.setParams({ passwordReset: undefined });
    }
  }, [passwordReset]);

  useFocusEffect(
    useCallback(() => {
      faceId.refresh();
    }, [faceId.refresh]),
  );

  function handleGuestPress() {
    setGuestMode(true);
    resetStackTo('/dashboard');
  }

  function handleRegisterPress() {
    router.push('/register');
  }

  function handleIdentomatDemoPress() {
    // router.push('/identomat-demo?mode=guest');
  }

  function handleForgotPasswordPress() {
    router.push('/forgot-password');
  }

  const handleFaceIdPress = useCallback(async () => {
    if (isFaceIdLoading) return;
    setIsFaceIdLoading(true);
    try {
      const res = await faceId.authenticateAndGetCredentials(
        t('faceId.loginPromptMessage'),
      );
      if (res.ok) {
        const result = await login.submitWithCredentials(res.credentials);
        // Only forget Face ID when the credentials are genuinely rejected (401).
        // Transient failures (network, lockout, server errors) must keep Face ID
        // so the button stays for the user who enabled it. submitWithCredentials
        // already surfaces the error toast.
        if (!result.ok && isInvalidCredentialsError(result.error)) {
          await faceId.disable();
        }
        return;
      }
      if (res.reason === 'no_credentials') {
        await faceId.disable();
        showErrorToast(t('faceId.errorStoredCredentialsInvalid'));
        return;
      }
      if (res.reason === 'cancelled') {
        return;
      }
      showErrorToast(t('faceId.errorFailed'));
    } finally {
      setIsFaceIdLoading(false);
    }
  }, [faceId, login, t, isFaceIdLoading]);

  const showFaceId =
    !faceId.isLoading &&
    faceId.isEnabled &&
    faceId.hasCredentials &&
    faceId.availability.isAvailable;

  return (
    <LoginScreenLayout>
      <PasswordResetNoticeModal
        visible={showPasswordResetNotice}
        onClose={() => setShowPasswordResetNotice(false)}
      />
      <ForcedPasswordChangeModal {...login.forcedPwdChange} />
      <LoginOtpModal {...login.otpLogin} />
      <LoginForm
        control={login.control}
        errors={login.errors}
        onSubmit={login.onSubmit}
        submitDisabled={login.submitDisabled}
        onRegisterPress={handleRegisterPress}
        onGuestPress={handleGuestPress}
        onIdentomatDemoPress={handleIdentomatDemoPress}
        onForgotPasswordPress={handleForgotPasswordPress}
        faceId={{
          show: showFaceId,
          label:
            faceId.kind === 'fingerprint'
              ? t('faceId.loginButtonFingerprint')
              : t('faceId.loginButton'),
          iconName: faceId.kind === 'fingerprint' ? 'fingerprint' : 'face-recognition',
          onPress: () => { handleFaceIdPress(); },
          disabled: isFaceIdLoading,
        }}
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
