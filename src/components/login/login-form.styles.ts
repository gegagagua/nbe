import { StyleSheet } from 'react-native';

import { LoginElevation, LoginLayout, LoginPalette, LoginRadius, LoginTypography } from '@/constants/login';

export const loginFormStyles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: LoginLayout.cardMaxWidth,
    alignSelf: 'center',
    backgroundColor: LoginPalette.cardBackground,
    borderRadius: LoginRadius.card,
    padding: LoginLayout.cardPadding,
    shadowColor: LoginPalette.primary,
    shadowOffset: { width: 0, height: LoginElevation.cardShadowOffsetY },
    shadowOpacity: LoginElevation.cardShadowOpacity,
    shadowRadius: LoginElevation.cardShadowRadius,
    elevation: LoginElevation.cardAndroidElevation,
  },
  fields: {
    gap: LoginLayout.fieldGap,
    marginBottom: LoginLayout.fieldGap,
  },
  fieldRow: {
    gap: LoginLayout.brandTextGap,
  },
  fieldError: {
    color: LoginPalette.errorText,
    fontSize: LoginTypography.fieldValidation,
  },
  guestLink: {
    alignItems: 'center',
    paddingTop: LoginLayout.fieldGap,
  },
  guestLinkText: {
    color: LoginPalette.placeholderMuted,
    fontSize: LoginTypography.fieldValidation,
    textDecorationLine: 'underline',
  },
});
