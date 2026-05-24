import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { LoginPalette } from '@/constants/login';
import { Space, Typography } from '@/constants/theme';

import { registerFormFieldStyles } from './register-form-field.styles';

type RegisterFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
};

export function RegisterFormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  required = false,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: RegisterFormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View style={registerFormFieldStyles.fieldRow}>
          <View style={labelStyles.row}>
            <Text style={labelStyles.placeholder}>{placeholder}</Text>
            {required ? <Text style={labelStyles.asterisk}> *</Text> : null}
          </View>
          <Input
            value={typeof field.value === 'string' ? field.value : ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            errorMessage={fieldState.error?.message}
          />
          {fieldState.error?.message ? (
            <Text style={registerFormFieldStyles.fieldError}>
              {fieldState.error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}

const labelStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Space.extraSmall,
  },
  placeholder: {
    fontSize: Typography.small,
    color: LoginPalette.bodyText,
    fontWeight: '500',
  },
  asterisk: {
    fontSize: Typography.small,
    color: LoginPalette.errorText,
    fontWeight: '700',
  },
});
