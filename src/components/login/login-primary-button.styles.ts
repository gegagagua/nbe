import { StyleSheet } from 'react-native';

import { LoginLayout, LoginPalette, LoginRadius, LoginTypography } from '@/constants/login';

export const loginPrimaryButtonStyles = StyleSheet.create({
  pressable: {
    width: '100%',
    backgroundColor: LoginPalette.primary,
    borderRadius: LoginRadius.button,
    paddingVertical: LoginLayout.buttonPaddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableDisabled: {
    opacity: 0.55,
  },
  label: {
    color: LoginPalette.onPrimary,
    fontSize: LoginTypography.button,
    fontWeight: '600',
  },
});
