import { StyleSheet } from 'react-native';

import { LoginElevation, LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const newPasswordStepStyles = StyleSheet.create({
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
  requirementsText: {
    fontSize: Typography.small,
    color: LoginPalette.placeholderMuted,
    lineHeight: 18,
  },
  fields: {
    gap: Space.medium,
  },
  fieldRow: {
    gap: Space.extraSmall,
  },
  fieldError: {
    color: LoginPalette.errorText,
    fontSize: Typography.small,
  },
  successMessage: {
    fontSize: Typography.medium,
    color: '#1a7f37',
    textAlign: 'center',
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: Typography.medium,
    color: LoginPalette.errorText,
    textAlign: 'center',
  },
});
