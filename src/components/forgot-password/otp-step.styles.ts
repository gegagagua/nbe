import { StyleSheet } from 'react-native';

import { LoginElevation, LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const otpStepStyles = StyleSheet.create({
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
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Space.extraSmall,
  },
  timerText: {
    fontSize: Typography.medium,
    color: LoginPalette.primary,
    fontWeight: '600',
  },
  timerExpired: {
    color: LoginPalette.errorText,
  },
  fieldRow: {
    gap: Space.extraSmall,
  },
  fieldError: {
    color: LoginPalette.errorText,
    fontSize: Typography.small,
  },
  expiredMessage: {
    fontSize: Typography.small,
    color: LoginPalette.errorText,
    textAlign: 'center',
  },
  resendButton: {
    alignItems: 'center',
    paddingTop: Space.extraSmall,
  },
  resendButtonText: {
    color: LoginPalette.primary,
    fontSize: Typography.small,
    textDecorationLine: 'underline',
  },
  resendButtonDisabled: {
    opacity: 0.4,
  },
});
