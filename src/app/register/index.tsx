import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { LoginScreenLayout } from '@/components/login/login-screen-layout';
import { useRegisterFlowContext } from '@/components/register/register-flow-context';
import { RegisterNavRow } from '@/components/register/register-nav-row';
import { RegisterPhysicalForm } from '@/components/register/register-physical-form';
import { registerScreenBodyStyles as s } from '@/components/register/register-screen-body.styles';

export default function RegisterFormRoute() {
  const { t } = useTranslation();
  const flow = useRegisterFlowContext();

  return (
    <LoginScreenLayout title={t('login.registrationPageTitle')} contentAlign="top">
      <KeyboardAwareScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        bottomOffset={16}>
        {/* Back leaves the register flow entirely, returning to the auth page. */}
        <RegisterNavRow onBack={() => router.back()} />
        <View style={s.card}>
          <RegisterPhysicalForm
            initialValues={flow.formValues}
            onValidSubmit={(values) => { flow.handleFormSubmit(values); }}
          />
        </View>
      </KeyboardAwareScrollView>
    </LoginScreenLayout>
  );
}
