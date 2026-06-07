import { StyleSheet } from 'react-native';

import { LoginElevation, LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const caseGuestFinePanelStyles = StyleSheet.create({
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
  hint: {
    fontSize: Typography.small,
    color: LoginPalette.bodyText,
    lineHeight: 20,
  },
  fieldRow: {
    gap: Space.extraSmall,
  },
  label: {
    fontSize: Typography.small,
    color: LoginPalette.placeholderMuted,
    fontWeight: '600',
  },
  fieldError: {
    color: LoginPalette.errorText,
    fontSize: Typography.small,
  },
  resultCard: {
    backgroundColor: '#f5f7fa',
    borderRadius: Radius.small,
    padding: Space.medium,
    gap: Space.small,
  },
  resultLabel: {
    fontSize: Typography.small,
    color: LoginPalette.placeholderMuted,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: Typography.medium,
    fontWeight: '600',
    color: LoginPalette.titleText,
  },
  resultAmount: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.titleText,
  },
  notFound: {
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    textAlign: 'center',
    fontWeight: '600',
  },
});
