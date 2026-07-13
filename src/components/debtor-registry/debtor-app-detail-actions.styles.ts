import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const debtorAppDetailActionsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Space.small,
  },
  btn: {
    flex: 1,
    minHeight: DebtorRegistryLayout.inputHeight,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.small,
  },
  editBtn: {
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  payBtn: {
    backgroundColor: DebtorRegistryPalette.buttonBg,
  },
  editLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.buttonBg,
    textAlign: 'center',
  },
  payLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.buttonText,
    textAlign: 'center',
  },
});
