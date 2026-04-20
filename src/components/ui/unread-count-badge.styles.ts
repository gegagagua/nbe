import { StyleSheet } from 'react-native';

import { HomeDashboardLayoutConst, HomeDashboardPalette } from '@/constants/home-dashboard';
import { FontSize } from '@/constants/theme';

export const unreadCountBadgeStyles = StyleSheet.create({
  wrap: {
    minWidth: HomeDashboardLayoutConst.notificationBadgeMinWidth,
    height: HomeDashboardLayoutConst.notificationBadgeHeight,
    borderRadius: HomeDashboardLayoutConst.notificationBadgeRadius,
    paddingHorizontal: HomeDashboardLayoutConst.notificationBadgePadH,
    backgroundColor: HomeDashboardPalette.notifBadgeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: HomeDashboardPalette.notifBadgeText,
    fontSize: FontSize.xl,
    fontWeight: '800',
    lineHeight: HomeDashboardLayoutConst.notificationBadgeLineHeight,
  },
});
