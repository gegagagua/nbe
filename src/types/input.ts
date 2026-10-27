import type { StyleProp, ViewStyle } from 'react-native';
import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type InputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  errorMessage?: string;
  /** Enables one-time-code autofill from SMS (iOS QuickType + Android sms-otp). */
  otp?: boolean;
  /** Field label rendered above the input. */
  label?: string;
  /** Marks the field required (red asterisk next to the label). */
  required?: boolean;
  /** Muted helper text below the input (hidden when an error is shown). */
  helperText?: string;
  /** Leading glyph inside the field. */
  leftIcon?: IconName;
  /** Non-editable visual + behaviour. */
  disabled?: boolean;
  editable?: boolean;
  maxLength?: number;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};
