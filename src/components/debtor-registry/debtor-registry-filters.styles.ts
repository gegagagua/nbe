import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Spacing } from '@/constants/theme';

export const debtorRegistryFiltersStyles = StyleSheet.create({
  panel: {
    width: '100%',
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
    borderRadius: DebtorRegistryLayout.panelRadius,
    backgroundColor: DebtorRegistryPalette.panelBg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  panelWeb: {
    width: DebtorRegistryLayout.panelWidthWeb,
  },
  title: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.inputBg,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  toggleText: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  label: {
    fontSize: DebtorRegistryTypography.label,
    color: DebtorRegistryPalette.textPrimary,
    fontWeight: '600',
  },
  input: {
    height: DebtorRegistryLayout.inputHeight,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.inputBg,
    paddingHorizontal: Spacing.two,
    fontSize: DebtorRegistryTypography.input,
    color: DebtorRegistryPalette.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  dateInput: {
    flex: 1,
  },
  actions: {
    marginTop: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  searchButton: {
    flex: 1,
    height: DebtorRegistryLayout.inputHeight,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.buttonText,
  },
  clearText: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
});
