import { StyleSheet } from 'react-native';

import { HomeDashboardPalette } from '@/constants/home-dashboard';
import { LoginElevation, LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const profileScreenStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: HomeDashboardPalette.pageBg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Space.medium,
    gap: Space.medium,
    paddingBottom: Space.extraLarge,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.medium,
    paddingVertical: Space.small,
    gap: Space.small,
  },
  backButton: {
    padding: Space.small,
  },
  backButtonText: {
    color: LoginPalette.primary,
    fontSize: Typography.medium,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: Typography.extraLarge,
    fontWeight: '700',
    color: LoginPalette.titleText,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.medium,
    padding: Space.large,
    shadowColor: LoginPalette.primary,
    shadowOffset: { width: 0, height: LoginElevation.cardShadowOffsetY },
    shadowOpacity: LoginElevation.cardShadowOpacity,
    shadowRadius: LoginElevation.cardShadowRadius,
    elevation: LoginElevation.cardAndroidElevation,
    gap: Space.medium,
  },
  sectionTitle: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.titleText,
    marginBottom: Space.extraSmall,
  },
  fieldGroup: {
    gap: Space.small,
  },
  fieldRow: {
    gap: Space.extraSmall,
  },
  label: {
    fontSize: Typography.small,
    color: LoginPalette.placeholderMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueText: {
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    paddingVertical: Space.extraSmall,
    paddingHorizontal: Space.small,
    backgroundColor: '#f5f7fa',
    borderRadius: Radius.extraSmall,
  },
  fieldError: {
    fontSize: Typography.small,
    color: LoginPalette.errorText,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: Space.small,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: LoginPalette.primary,
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: Typography.medium,
    fontWeight: '600',
  },
  buttonOutline: {
    flex: 1,
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LoginPalette.primary,
  },
  buttonOutlineText: {
    color: LoginPalette.primary,
    fontSize: Typography.medium,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  signOutButton: {
    backgroundColor: LoginPalette.errorText,
    borderRadius: Radius.small,
    paddingVertical: Space.medium,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: Typography.medium,
    fontWeight: '700',
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
  divider: {
    height: 1,
    backgroundColor: '#e8edf3',
  },
});
