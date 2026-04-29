import { StyleSheet } from 'react-native';

import { HomeDashboardLayoutConst, HomeDashboardPalette } from '@/constants/home-dashboard';
import { LoginLayout } from '@/constants/login';
import { FontSize, Spacing } from '@/constants/theme';

export const homeHeaderStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: HomeDashboardPalette.headerBg,
    paddingVertical: HomeDashboardLayoutConst.headerPaddingV,
    paddingHorizontal: LoginLayout.horizontalInset,
  },
  logoWrap: {
    flexShrink: 1,
    maxWidth: '58%',
  },
  logoText: {
    color: HomeDashboardPalette.headerText,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  actionPress: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.two,
  },
});
