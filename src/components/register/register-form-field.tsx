import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Input } from '@/components/ui/input';

import { registerFormFieldStyles } from './register-form-field.styles';

type RegisterFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
};

export function RegisterFormField<T extends FieldValues>({
  control,
  name,
  placeholder,
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
