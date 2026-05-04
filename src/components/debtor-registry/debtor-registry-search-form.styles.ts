import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const debtorRegistrySearchFormStyles = StyleSheet.create({
  wrap: {
    gap: Space.small,
  },
  label: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: DebtorRegistryPalette.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.small,
    marginTop: Space.extraSmall,
  },
  clearPress: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Space.small,
  },
  clearText: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.textMuted,
  },
  panel: {
    borderRadius: DebtorRegistryLayout.panelRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
    backgroundColor: DebtorRegistryPalette.panelBg,
    padding: Space.medium,
    gap: Space.medium,
  },
});
