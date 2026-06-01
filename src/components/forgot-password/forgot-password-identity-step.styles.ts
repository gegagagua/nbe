import { StyleSheet } from 'react-native';

import { LoginElevation, LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const forgotPasswordIdentityStepStyles = StyleSheet.create({
  card: {
    backgroundColor: LoginPalette.cardBackground,
    borderRadius: Radius.medium,
    padding: Space.large,
    shadowColor: LoginPalette.primary,
    shadowOffset: { width: 0, height: LoginElevation.cardShadowOffsetY },
    shadowOpacity: LoginElevation.cardShadowOpacity,
    shadowRadius: LoginElevation.cardShadowRadius,
    elevation: LoginElevation.cardAndroidElevation,
    gap: Space.medium,
  },
  title: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.titleText,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    textAlign: 'center',
  },
  fieldRow: {
    gap: Space.extraSmall,
  },
  fieldError: {
    color: LoginPalette.errorText,
    fontSize: Typography.small,
  },
  statusMessage: {
    fontSize: Typography.small,
    textAlign: 'center',
    fontWeight: '600',
  },
  statusSuccess: {
    color: '#1a7f37',
  },
  statusError: {
    color: LoginPalette.errorText,
  },
});
