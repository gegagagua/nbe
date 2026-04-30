import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useRegisterPhysicalForm } from '@/hooks/use-register-physical-form';

import { registerFormActionsStyles } from './register-form-actions.styles';
import { RegisterFormField } from './register-form-field';

export function RegisterPhysicalForm() {
  const { t } = useTranslation();
  const { control, onSubmit, submitDisabled } = useRegisterPhysicalForm();

  return (
    <View>
      <RegisterFormField
        control={control}
        name="firstName"
        placeholder={t('login.registerPhysicalFirstName')}
        autoCapitalize="words"
      />
      <RegisterFormField
        control={control}
        name="lastName"
        placeholder={t('login.registerPhysicalLastName')}
        autoCapitalize="words"
      />
      <RegisterFormField
        control={control}
        name="personalId"
        placeholder={t('login.registerPhysicalPersonalId')}
        keyboardType="number-pad"
      />
      <RegisterFormField
        control={control}
        name="email"
        placeholder={t('login.registerPhysicalEmail')}
        keyboardType="email-address"
      />
      <RegisterFormField
        control={control}
        name="phone"
        placeholder={t('login.registerPhysicalPhone')}
        keyboardType="phone-pad"
      />
      <RegisterFormField
        control={control}
        name="password"
        placeholder={t('login.registerPhysicalPassword')}
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
