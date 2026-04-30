import { StyleSheet } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { Space, Typography } from '@/constants/theme';

export const registerFormFieldStyles = StyleSheet.create({
  fieldRow: {
    gap: Space.extraSmall,
    marginBottom: Space.medium,
  },
  fieldError: {
    color: LoginPalette.errorText,
    fontSize: Typography.small,
  },
});
