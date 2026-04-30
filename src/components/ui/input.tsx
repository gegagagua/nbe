import { TextInput, View } from 'react-native';

import { LoginPalette } from '@/constants/login';
import type { InputProps } from '@/types/input';

import { inputStyles } from './input.styles';

export function Input({
  value,
  onChangeText,
  onBlur,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  errorMessage,
}: InputProps) {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={LoginPalette.placeholderMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        style={[
          inputStyles.input,
          errorMessage ? inputStyles.inputError : null,
        ]}
      />
    </View>
  );
}
