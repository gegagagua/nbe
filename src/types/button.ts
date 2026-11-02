import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Visual intent. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Control height + type size. Defaults to `md`. */
  size?: ButtonSize;
  /** Shows a spinner, blocks presses, keeps width stable. */
  loading?: boolean;
  /** Stretch to fill the parent width. Defaults to `true` (legacy behaviour). */
  fullWidth?: boolean;
  /** Optional leading / trailing MaterialCommunityIcons glyph. */
  leftIcon?: IconName;
  rightIcon?: IconName;
  /** Fire light haptic feedback on press. Defaults to `true`. */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
};
