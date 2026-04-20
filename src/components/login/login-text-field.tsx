import { TextInput, View } from 'react-native';

import { LoginPalette } from '@/constants/login';
import type { LoginTextFieldProps } from '@/types/login';

import { loginTextFieldStyles } from './login-text-field.styles';

export function LoginTextField({
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry,
  autoCapitalize = 'none',
  errorMessage,
}: LoginTextFieldProps) {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={LoginPalette.placeholderMuted}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        style={[
          loginTextFieldStyles.input,
          errorMessage ? loginTextFieldStyles.inputError : null,
        ]}
      />
    </View>
  );
}
