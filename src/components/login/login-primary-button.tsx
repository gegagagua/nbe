import { Pressable, Text } from 'react-native';

import { LoginInteraction } from '@/constants/login';
import type { LoginPrimaryButtonProps } from '@/types/login';

import { loginPrimaryButtonStyles } from './login-primary-button.styles';

export function LoginPrimaryButton({ label, onPress, disabled }: LoginPrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        loginPrimaryButtonStyles.pressable,
        disabled && loginPrimaryButtonStyles.pressableDisabled,
        pressed && !disabled && { opacity: LoginInteraction.pressedOpacity },
      ]}>
      <Text style={loginPrimaryButtonStyles.label}>{label}</Text>
    </Pressable>
  );
}
