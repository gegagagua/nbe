import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

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
  otp,
}: InputProps) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={inputStyles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={LoginPalette.placeholderMuted}
        secureTextEntry={secureTextEntry && hidden}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        // One-time-code autofill. iOS reads the QuickType suggestion above the
        // keyboard; Android needs autoComplete="sms-otp" + autofill enabled.
        textContentType={otp ? 'oneTimeCode' : undefined}
        autoComplete={otp ? 'sms-otp' : undefined}
        importantForAutofill={otp ? 'yes' : undefined}
        style={[
          inputStyles.input,
          secureTextEntry ? inputStyles.inputWithEye : null,
          errorMessage ? inputStyles.inputError : null,
        ]}
      />
      {secureTextEntry && (
        <Pressable
          style={inputStyles.eyeButton}
          onPress={() => setHidden((h) => !h)}
          accessibilityRole="button"
          hitSlop={8}>
          <MaterialCommunityIcons
            name={hidden ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={LoginPalette.placeholderMuted}
          />
        </Pressable>
      )}
    </View>
  );
}
