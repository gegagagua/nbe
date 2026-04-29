import { StyleSheet } from 'react-native';

import { HomeDashboardPalette } from '@/constants/home-dashboard';
import { Spacing } from '@/constants/theme';

export const homeTabContentShellStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: HomeDashboardPalette.pageBg,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
});
