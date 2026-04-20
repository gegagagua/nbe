import { StyleSheet } from 'react-native';

import { HomeDashboardLayoutConst } from '@/constants/home-dashboard';
import { Spacing } from '@/constants/theme';

export const homeNavGridStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: HomeDashboardLayoutConst.gridGap,
    columnGap: Spacing.two,
  },
});
