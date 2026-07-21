import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const debtorRegistrySearchFormStyles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  toggleButton: {
    width: DebtorRegistryLayout.filterPanelToggleSize,
    height: DebtorRegistryLayout.filterPanelToggleSize,
    borderRadius: DebtorRegistryLayout.filterPanelToggleSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    backgroundColor: DebtorRegistryPalette.inputBg,
  },
  wrap: {
    gap: Space.small,
  },
  label: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: DebtorRegistryPalette.textSecondary,
  },
  errorText: {
    fontSize: DebtorRegistryTypography.small,
    color: '#b42318',
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
