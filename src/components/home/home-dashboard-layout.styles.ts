import { StyleSheet } from 'react-native';

import { HomeDashboardPalette } from '@/constants/home-dashboard';
import { LoginLayout } from '@/constants/login';

export const homeDashboardLayoutStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: HomeDashboardPalette.pageBg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: LoginLayout.horizontalInset,
    paddingVertical: LoginLayout.cardPadding,
  },
});
