import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { LoginPalette } from '@/constants/login';
import { Space, Typography } from '@/constants/theme';
import { useRegisterPhysicalForm } from '@/hooks/use-register-physical-form';
import type { RegisterPhysicalValues } from '@/types/register-form-values';

import { registerFormActionsStyles } from './register-form-actions.styles';
import { RegisterFormField } from './register-form-field';

type Props = {
  onValidSubmit: (values: RegisterPhysicalValues) => void;
};

export function RegisterPhysicalForm({ onValidSubmit }: Props) {
  const { t } = useTranslation();
  const { control, onSubmit, submitDisabled } = useRegisterPhysicalForm(onValidSubmit);

  return (
    <View>
      <Text style={styles.requirementsHint}>{t('login.registerPasswordRequirements')}</Text>

      <RegisterFormField
        control={control}
        name="personalId"
        placeholder={t('login.registerUsername')}
        required
        keyboardType="number-pad"
      />
      <RegisterFormField
        control={control}
        name="actualAddress"
        placeholder={t('login.registerPhysicalActualAddress')}
        required
        autoCapitalize="sentences"
      />
      <RegisterFormField
        control={control}
        name="phone"
        placeholder={t('login.registerPhysicalPhone')}
        required
        keyboardType="phone-pad"
      />
      <RegisterFormField
        control={control}
        name="password"
        placeholder={t('login.registerPhysicalPassword')}
        required
        secureTextEntry
      />
      <RegisterFormField
        control={control}
        name="confirmPassword"
        placeholder={t('login.registerPasswordConfirm')}
        required
        secureTextEntry
      />

      {/* Optional fields */}
      <RegisterFormField
        control={control}
        name="legalAddress"
        placeholder={t('login.registerPhysicalLegalAddress')}
        autoCapitalize="sentences"
      />
      <RegisterFormField
        control={control}
        name="email"
        placeholder={t('login.registerPhysicalEmail')}
        keyboardType="email-address"
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

const styles = StyleSheet.create({
  requirementsHint: {
    fontSize: Typography.small,
    color: LoginPalette.placeholderMuted,
    marginBottom: Space.medium,
    lineHeight: 18,
  },
});
