import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useRegisterLegalForm } from '@/hooks/use-register-legal-form';

import { registerFormActionsStyles } from './register-form-actions.styles';
import { RegisterFormField } from './register-form-field';

export function RegisterLegalForm() {
  const { t } = useTranslation();
  const { control, onSubmit, submitDisabled } = useRegisterLegalForm();

  return (
    <View>
      <RegisterFormField
        control={control}
        name="username"
        placeholder={t('login.registerUsername')}
        autoCapitalize="none"
      />
      <RegisterFormField
        control={control}
        name="companyName"
        placeholder={t('login.registerLegalCompanyName')}
        autoCapitalize="words"
      />
      <RegisterFormField
        control={control}
        name="identificationCode"
        placeholder={t('login.registerLegalIdentificationCode')}
      />
      <RegisterFormField
        control={control}
        name="representativeName"
        placeholder={t('login.registerLegalRepresentative')}
        autoCapitalize="words"
      />
      <RegisterFormField
        control={control}
        name="representativePersonalId"
        placeholder={t('login.registerLegalRepresentativePersonalId')}
        autoCapitalize="none"
        keyboardType="number-pad"
      />
      <RegisterFormField
        control={control}
        name="email"
        placeholder={t('login.registerLegalEmail')}
        keyboardType="email-address"
      />
      <RegisterFormField
        control={control}
        name="phone"
        placeholder={t('login.registerLegalPhone')}
        keyboardType="phone-pad"
      />
      <RegisterFormField
        control={control}
        name="password"
        placeholder={t('login.registerLegalPassword')}
        secureTextEntry
      />
      <RegisterFormField
        control={control}
        name="confirmPassword"
        placeholder={t('login.registerPasswordConfirm')}
        secureTextEntry
      />
      <View style={registerFormActionsStyles.submit}>
        <Button
          label={t('login.registerSubmit')}
          onPress={() => void onSubmit()}
          disabled={submitDisabled}
        />
      </View>
    </View>
  );
}
