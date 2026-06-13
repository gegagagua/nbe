import { StyleSheet } from 'react-native';

import { HomeDashboardPalette } from '@/constants/home-dashboard';

export const homeScreenStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: HomeDashboardPalette.pageBg,
  },
  body: {
    flex: 1,
  },
  navFallback: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
