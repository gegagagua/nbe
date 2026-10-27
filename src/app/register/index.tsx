import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { useRegisterFlowContext } from '@/components/register/register-flow-context';
import { RegisterNavRow } from '@/components/register/register-nav-row';
import { RegisterPhysicalForm } from '@/components/register/register-physical-form';
import { Card } from '@/components/ui/card';

export default function RegisterFormRoute() {
  const { t } = useTranslation();
  const flow = useRegisterFlowContext();

  // Scrolling + keyboard handling are provided by LoginScreenLayout, so this
  // screen only lays out its content (no inner scroll view — that would nest).
  return (
    <LoginScreenLayout title={t('login.registrationPageTitle')} contentAlign="top">
      <View className="w-full max-w-[420px] grow self-center pb-4">
        {/* Back leaves the register flow entirely, returning to the auth page. */}
        <RegisterNavRow onBack={() => router.back()} />
        <Card padding="lg" elevation="lg" className="w-full self-center rounded-2xl">
          <RegisterPhysicalForm
            initialValues={flow.formValues}
            onValidSubmit={(values) => { flow.handleFormSubmit(values); }}
          />
        </Card>
      </View>
    </LoginScreenLayout>
  );
}
