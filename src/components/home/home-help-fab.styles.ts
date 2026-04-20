import { StyleSheet } from 'react-native';

import { HomeDashboardLayoutConst, HomeDashboardPalette } from '@/constants/home-dashboard';
import { Spacing } from '@/constants/theme';

export const homeHelpFabStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.four,
    bottom: HomeDashboardLayoutConst.fabBottomOffset,
    width: HomeDashboardLayoutConst.fabSize,
    height: HomeDashboardLayoutConst.fabSize,
    borderRadius: HomeDashboardLayoutConst.fabRadius,
    backgroundColor: HomeDashboardPalette.cardBg,
    borderWidth: 1,
    borderColor: HomeDashboardPalette.fabBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: HomeDashboardPalette.titleText,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: HomeDashboardLayoutConst.fabShadowOpacity,
    shadowRadius: 4,
    elevation: 3,
  },
});
