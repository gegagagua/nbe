import { StyleSheet } from 'react-native';

import { DebtorRegistryLayout, DebtorRegistryPalette } from '@/constants/debtor-registry';
import { FontSize } from '@/constants/theme';

export const debtorAppListStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    gap: DebtorRegistryLayout.listRowGap,
  },
  stateText: {
    color: DebtorRegistryPalette.textSecondary,
    fontSize: FontSize.md,
  },
});
