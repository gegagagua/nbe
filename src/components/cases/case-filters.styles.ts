import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Spacing } from '@/constants/theme';

export const caseFiltersStyles = StyleSheet.create({
  participantBlock: {
    gap: Spacing.two,
    width: '100%',
  },
  panel: {
    width: '100%',
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
    borderRadius: DebtorRegistryLayout.panelRadius,
    backgroundColor: DebtorRegistryPalette.panelBg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRowSpacer: {
    flex: 1,
  },
  title: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  sectionTitle: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
    marginBottom: Spacing.one,
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.inputBg,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: DebtorRegistryPalette.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  half: {
    flex: 1,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  actions: {
    marginTop: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
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
    color: DebtorRegistryPalette.buttonText,
    fontWeight: '700',
  },
  clearText: {
    color: DebtorRegistryPalette.textPrimary,
    fontWeight: '700',
  },
});
