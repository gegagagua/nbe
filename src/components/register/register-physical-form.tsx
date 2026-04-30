import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { LoginCopy } from '@/constants/login-copy';
import { useRegisterPhysicalForm } from '@/hooks/use-register-physical-form';

import { registerFormActionsStyles } from './register-form-actions.styles';
import { RegisterFormField } from './register-form-field';

export function RegisterPhysicalForm() {
  const { control, onSubmit, submitDisabled } = useRegisterPhysicalForm();

  return (
    <View>
      <RegisterFormField
        control={control}
        name="firstName"
        placeholder={LoginCopy.registerPhysicalFirstName}
        autoCapitalize="words"
      />
      <RegisterFormField
        control={control}
        name="lastName"
        placeholder={LoginCopy.registerPhysicalLastName}
        autoCapitalize="words"
      />
      <RegisterFormField
        control={control}
        name="personalId"
        placeholder={LoginCopy.registerPhysicalPersonalId}
        keyboardType="number-pad"
      />
      <RegisterFormField
        control={control}
        name="email"
        placeholder={LoginCopy.registerPhysicalEmail}
        keyboardType="email-address"
      />
      <RegisterFormField
        control={control}
        name="phone"
        placeholder={LoginCopy.registerPhysicalPhone}
        keyboardType="phone-pad"
      />
      <RegisterFormField
        control={control}
        name="password"
        placeholder={LoginCopy.registerPhysicalPassword}
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
