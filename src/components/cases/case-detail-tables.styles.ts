import { StyleSheet } from "react-native";

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from "@/constants/debtor-registry";
import { Space } from "@/constants/theme";

export const caseDetailTableStyles = StyleSheet.create({
  tableHead: {
    flexDirection: "row",
    backgroundColor: DebtorRegistryPalette.panelBg,
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
  },
  tableHeadCell: {
    flex: 1,
    padding: Space.small,
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textPrimary,
  },
  tableHeadCellNarrow: {
    width: 72,
    padding: Space.small,
    fontSize: DebtorRegistryTypography.small,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
  },
  tableCell: {
    flex: 1,
    padding: Space.small,
    gap: Space.extraSmall,
    fontSize: DebtorRegistryTypography.body,
  },
  subSectionTitle: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
    padding: Space.small,
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  flex2: { flex: 2 },
  padSm: { padding: Space.small },
  kvCardList: {
    marginTop: Space.small,
    gap: Space.medium,
  },
  kvRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Space.small,
    paddingVertical: Space.small,
    paddingHorizontal: Space.small,
  },
  kvLabel: {
    flex: 1,
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textSecondary,
  },
  kvValue: {
    flex: 1,
    alignItems: "flex-end",
    gap: Space.extraSmall,
  },
  kvValueText: {
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.textPrimary,
    textAlign: "right",
  },
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
