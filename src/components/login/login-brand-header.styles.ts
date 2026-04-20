import { StyleSheet } from 'react-native';

import { LoginLayout, LoginPalette, LoginTypography } from '@/constants/login';

export const loginBrandHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LoginLayout.logoMarkGap,
    marginBottom: LoginLayout.fieldGap,
  },
  markStack: {
    width: LoginLayout.logoMarkSize,
    height: LoginLayout.logoMarkSize,
    flexDirection: 'column',
  },
  markTop: {
    flex: 1,
    backgroundColor: LoginPalette.logoRed,
    borderTopLeftRadius: LoginLayout.logoMarkInnerRadius,
    borderTopRightRadius: LoginLayout.logoMarkInnerRadius,
  },
  markBottom: {
    flex: 1,
    backgroundColor: LoginPalette.logoBlue,
    borderBottomLeftRadius: LoginLayout.logoMarkInnerRadius,
    borderBottomRightRadius: LoginLayout.logoMarkInnerRadius,
  },
  textBlock: {
    flex: 1,
    gap: LoginLayout.brandTextGap,
  },
  geo: {
    fontSize: LoginTypography.brandGeo,
    fontWeight: '700',
    color: LoginPalette.primary,
  },
  en: {
    fontSize: LoginTypography.brandEn,
    fontWeight: '600',
    color: LoginPalette.bodyText,
    letterSpacing: 0.3,
  },
});
