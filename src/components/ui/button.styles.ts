import { StyleSheet } from 'react-native';

import { Layout } from '@/constants/layout';
import { LoginPalette } from '@/constants/login';
import { Radius, Typography } from '@/constants/theme';

export const buttonStyles = StyleSheet.create({
  pressable: {
    width: '100%',
    backgroundColor: LoginPalette.primary,
    borderRadius: Radius.small,
    paddingVertical: Layout.buttonPaddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableDisabled: {
    opacity: 0.55,
  },
  label: {
    color: LoginPalette.onPrimary,
    fontSize: Typography.large,
    fontWeight: '600',
  },
});
