import { StyleSheet } from 'react-native';

import { LoginLayout, LoginPalette, LoginTypography } from '@/constants/login';
import { Spacing } from '@/constants/theme';

export const loginFooterStyles = StyleSheet.create({
  bar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    backgroundColor: LoginPalette.primary,
    paddingHorizontal: LoginLayout.horizontalInset,
    paddingTop: LoginLayout.footerPaddingTop,
  },
  left: {
    flex: 1,
    color: LoginPalette.onPrimary,
    fontSize: LoginTypography.footer,
    lineHeight: LoginTypography.footerLineHeight,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    maxWidth: LoginLayout.footerRightMaxWidth,
  },
  agencyText: {
    flexShrink: 1,
    color: LoginPalette.onPrimary,
    fontSize: LoginTypography.agencyMark,
    fontWeight: '600',
    lineHeight: LoginTypography.agencyLineHeight,
  },
});
