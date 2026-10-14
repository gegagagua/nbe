import { Redirect, router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { IdentomatDemoScreen } from '@/components/identomat/identomat-demo-screen';
import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { useRegisterFlowContext } from '@/components/register/register-flow-context';
import { isAllowedWebViewUrl } from '@/lib/is-allowed-webview-url';

export default function RegisterIdentomatRoute() {
  const { t } = useTranslation();
  const flow = useRegisterFlowContext();

  // The Identomat step is only reachable once OTP verification returns a
  // verification URL; guard against landing here without one (e.g. a reload).
  //
  // Security (PEN073 F-2): the URL comes straight from the backend response and
  // is loaded into a WebView with camera/mic access. Validate it against the
  // Identomat host allowlist before mounting — a MITM-tampered response pointing
  // at an attacker origin must never reach the WebView. Fail closed back to OTP.
  if (!flow.verificationUrl || !isAllowedWebViewUrl(flow.verificationUrl)) {
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
