import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const debtorRegistryApplicationRowActionsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Space.small,
    marginTop: Space.small,
  },
  btn: {
    flex: 1,
    minHeight: DebtorRegistryLayout.inputHeight,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.buttonBg,
    backgroundColor: DebtorRegistryPalette.panelBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.small,
  },
  btnLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.buttonBg,
    textAlign: 'center',
  },
});
