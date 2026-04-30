import { StyleSheet } from 'react-native';

import { Space } from '@/constants/theme';

export const homeDashboardLayoutStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: Space.large,
    paddingVertical: Space.large,
    flexGrow: 1,
  },
});
