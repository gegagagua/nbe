import { StyleSheet } from 'react-native';

import { Layout } from '@/constants/layout';
import { LoginElevation, LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const registerScreenBodyStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    maxWidth: Layout.cardMaxWidth,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Space.medium,
  },
  scrollContentCenter: {
    flexGrow: 1,
    paddingBottom: Space.medium,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: LoginPalette.cardBackground,
    borderRadius: Radius.medium,
    padding: Space.large,
    shadowColor: LoginPalette.primary,
    shadowOffset: { width: 0, height: LoginElevation.cardShadowOffsetY },
    shadowOpacity: LoginElevation.cardShadowOpacity,
    shadowRadius: LoginElevation.cardShadowRadius,
    elevation: LoginElevation.cardAndroidElevation,
  },
  successCard: {
    alignItems: 'center',
    gap: Space.medium,
  },
  successIcon: {
    fontSize: 48,
    color: LoginPalette.successText,
  },
  successTitle: {
    fontSize: Typography.extraLarge,
    fontWeight: '700',
    color: LoginPalette.successText,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    textAlign: 'center',
    lineHeight: 22,
  },
  successButton: {
    backgroundColor: LoginPalette.primary,
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    paddingHorizontal: Space.extraLarge,
    marginTop: Space.small,
  },
  successButtonText: {
    color: LoginPalette.onPrimary,
    fontSize: Typography.medium,
    fontWeight: '700',
  },
  identomatTitle: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.titleText,
    marginBottom: Space.small,
  },
  identomatDescription: {
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    lineHeight: 22,
    marginBottom: Space.medium,
  },
  identomatButtons: {
    gap: Space.small,
  },
  identomatPrimaryButton: {
    backgroundColor: LoginPalette.primary,
    borderRadius: Radius.small,
    paddingVertical: Space.medium,
    alignItems: 'center',
  },
  identomatPrimaryButtonText: {
    color: LoginPalette.onPrimary,
    fontSize: Typography.medium,
    fontWeight: '700',
  },
  identomatFailButton: {
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    alignItems: 'center',
  },
  identomatFailButtonText: {
    color: LoginPalette.errorText,
    fontSize: Typography.small,
    textDecorationLine: 'underline',
  },
});
