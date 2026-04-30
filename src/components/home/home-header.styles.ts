import { StyleSheet } from 'react-native';

import { HomeDashboardLayoutConst, HomeDashboardPalette } from '@/constants/home-dashboard';
import { Space, Typography } from '@/constants/theme';

export const homeHeaderStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: HomeDashboardPalette.headerBg,
    paddingVertical: HomeDashboardLayoutConst.headerPaddingV,
    paddingHorizontal: Space.large,
  },
  logoWrap: {
    flexShrink: 1,
    maxWidth: '58%',
  },
  logoText: {
    color: HomeDashboardPalette.headerText,
    fontSize: Typography.extraLarge,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.small,
  },
  actionPress: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Space.small,
  },
});
