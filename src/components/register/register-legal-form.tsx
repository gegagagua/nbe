import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { LoginCopy } from '@/constants/login-copy';
import { useRegisterLegalForm } from '@/hooks/use-register-legal-form';

import { registerFormActionsStyles } from './register-form-actions.styles';
import { RegisterFormField } from './register-form-field';

export function RegisterLegalForm() {
  const { control, onSubmit, submitDisabled } = useRegisterLegalForm();

  return (
    <View>
      <RegisterFormField
        control={control}
        name="companyName"
        placeholder={LoginCopy.registerLegalCompanyName}
        autoCapitalize="words"
      />
      <RegisterFormField
        control={control}
        name="identificationCode"
        placeholder={LoginCopy.registerLegalIdentificationCode}
      />
      <RegisterFormField
        control={control}
        name="representativeName"
        placeholder={LoginCopy.registerLegalRepresentative}
        autoCapitalize="words"
      />
      <RegisterFormField
        control={control}
        name="email"
        placeholder={LoginCopy.registerLegalEmail}
        keyboardType="email-address"
      />
      <RegisterFormField
        control={control}
        name="phone"
        placeholder={LoginCopy.registerLegalPhone}
        keyboardType="phone-pad"
      />
      <RegisterFormField
        control={control}
        name="password"
        placeholder={LoginCopy.registerLegalPassword}
        secureTextEntry
      />
      <RegisterFormField
        control={control}
        name="confirmPassword"
        placeholder={LoginCopy.registerPasswordConfirm}
        secureTextEntry
      />
      <View style={registerFormActionsStyles.submit}>
        <Button
          label={LoginCopy.registerSubmit}
          onPress={() => void onSubmit()}
          disabled={submitDisabled}
        />
      </View>
    </View>
  );
}
