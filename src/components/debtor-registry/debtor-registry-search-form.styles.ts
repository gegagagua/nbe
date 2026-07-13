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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.small,
    marginTop: Space.extraSmall,
  },
  searchButton: {
    flex: 1,
    height: DebtorRegistryLayout.inputHeight,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  clearButton: {
    width: DebtorRegistryLayout.inputHeight,
    height: DebtorRegistryLayout.inputHeight,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DebtorRegistryPalette.inputBg,
  },
  searchText: {
    color: DebtorRegistryPalette.buttonText,
    fontWeight: '700',
  },
  clearText: {
    color: DebtorRegistryPalette.textPrimary,
    fontWeight: '700',
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
