import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';

export const debtorRegistryApplicationListStyles = StyleSheet.create({
  list: {
    gap: DebtorRegistryLayout.listRowGap,
  },
  state: {
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.textSecondary,
  },
});
