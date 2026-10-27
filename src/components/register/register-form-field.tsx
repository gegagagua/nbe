import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { View } from 'react-native';

import { Input } from '@/components/ui/input';

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
        <View className="mb-3 gap-1">
          <Input
            value={typeof field.value === 'string' ? field.value : ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label={placeholder}
            placeholder={placeholder}
            required={required}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            errorMessage={fieldState.error?.message}
          />
        </View>
      )}
    />
  );
}
