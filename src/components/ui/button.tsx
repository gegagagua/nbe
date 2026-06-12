import { Text } from 'react-native';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import type { ButtonProps } from '@/types/button';

import { buttonStyles } from './button.styles';

export function Button({ label, onPress, disabled }: ButtonProps) {
  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      pressedScale={0.96}
      pressedOpacity={0.9}
      style={[buttonStyles.pressable, disabled && buttonStyles.pressableDisabled]}>
      <Text style={buttonStyles.label}>{label}</Text>
    </AnimatedPressable>
  );
}
