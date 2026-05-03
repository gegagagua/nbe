import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const caseDetailPanelStyles = StyleSheet.create({
  subPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    padding: Space.small,
    marginBottom: Space.medium,
    backgroundColor: DebtorRegistryPalette.inputBg,
  },
  subPickerLabel: {
    fontSize: DebtorRegistryTypography.label,
    color: DebtorRegistryPalette.textPrimary,
  },
  panel: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
    borderRadius: DebtorRegistryLayout.panelRadius,
    backgroundColor: DebtorRegistryPalette.cardBg,
    marginBottom: Space.medium,
    overflow: 'hidden',
  },
  panelTitle: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.buttonBg,
    padding: Space.small,
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
  },
  panelHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Space.small,
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
  },
  panelBodyPad: {
    paddingHorizontal: Space.medium,
    paddingVertical: Space.small,
  },
});
