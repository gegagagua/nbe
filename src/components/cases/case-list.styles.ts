import { StyleSheet } from 'react-native';

import { DebtorRegistryLayout, DebtorRegistryPalette } from '@/constants/debtor-registry';
import { FontSize } from '@/constants/theme';

export const caseListStyles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: DebtorRegistryLayout.listRowGap,
  },
  stateText: {
    color: DebtorRegistryPalette.textSecondary,
    fontSize: FontSize.md,
  },
});
