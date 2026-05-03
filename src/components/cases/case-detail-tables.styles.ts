import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const caseDetailTableStyles = StyleSheet.create({
  tableHead: {
    flexDirection: 'row',
    backgroundColor: DebtorRegistryPalette.panelBg,
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
  },
  tableHeadCell: {
    flex: 1,
    padding: Space.small,
    fontSize: DebtorRegistryTypography.small,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  tableHeadCellNarrow: {
    width: 72,
    padding: Space.small,
    fontSize: DebtorRegistryTypography.small,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
  },
  tableCell: {
    flex: 1,
    padding: Space.small,
    gap: Space.extraSmall,
  },
  subSectionTitle: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: DebtorRegistryPalette.textPrimary,
    padding: Space.small,
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  flex2: { flex: 2 },
  padSm: { padding: Space.small },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
  },
  borderBox: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
    borderRadius: DebtorRegistryLayout.panelRadius,
  },
});
