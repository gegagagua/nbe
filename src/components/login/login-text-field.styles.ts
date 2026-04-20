import { StyleSheet } from 'react-native';

import { LoginLayout, LoginPalette, LoginRadius, LoginTypography } from '@/constants/login';

export const loginTextFieldStyles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: LoginPalette.inputBorder,
    backgroundColor: LoginPalette.inputFill,
    borderRadius: LoginRadius.field,
    paddingVertical: LoginLayout.inputPaddingVertical,
    paddingHorizontal: LoginLayout.inputPaddingHorizontal,
    fontSize: LoginTypography.input,
    color: LoginPalette.bodyText,
    minHeight: 48,
  },
  inputError: {
    borderColor: LoginPalette.errorText,
  },
});
