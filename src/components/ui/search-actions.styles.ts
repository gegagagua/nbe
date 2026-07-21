import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const searchActionsStyles = StyleSheet.create({
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
});
