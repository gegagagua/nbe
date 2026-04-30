import { Pressable, Text } from 'react-native';

import { LoginInteraction } from '@/constants/login';
import type { ButtonProps } from '@/types/button';

import { buttonStyles } from './button.styles';

export function Button({ label, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyles.pressable,
        disabled && buttonStyles.pressableDisabled,
        pressed && !disabled && { opacity: LoginInteraction.pressedOpacity },
      ]}>
      <Text style={buttonStyles.label}>{label}</Text>
    </Pressable>
  );
}
