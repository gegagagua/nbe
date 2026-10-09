import { StyleSheet } from "react-native";

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from "@/constants/debtor-registry";
import { Space } from "@/constants/theme";

export const factsDetailStyles = StyleSheet.create({
  summary: {
    gap: Space.small,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Space.small,
  },
  caseNumber: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Space.extraSmall,
  },
  dateText: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textPrimary,
  },
  bureau: {
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.textSecondary,
  },
  tabBar: {
    flexDirection: "row",
    gap: Space.extraSmall,
    padding: Space.extraSmall,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Space.small,
    borderRadius: DebtorRegistryLayout.buttonRadius - 2,
  },
  tabActive: {
    backgroundColor: DebtorRegistryPalette.cardBg,
  },
  tabLabel: {
    fontSize: DebtorRegistryTypography.label,
    color: DebtorRegistryPalette.textSecondary,
  },
  tabLabelActive: {
    color: DebtorRegistryPalette.textPrimary,
    fontWeight: "700",
  },
  detailsCard: {
    backgroundColor: DebtorRegistryPalette.cardBg,
    borderRadius: DebtorRegistryLayout.cardRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.cardBorder,
    overflow: "hidden",
  },
  section: {
    padding: Space.medium,
    gap: Space.medium,
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: DebtorRegistryPalette.cardBorder,
  },
  sectionTitle: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  shaded: {
    gap: Space.medium,
    padding: Space.medium,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  field: {
    gap: Space.extraSmall,
  },
  fieldLabel: {
    fontSize: DebtorRegistryTypography.label,
    color: DebtorRegistryPalette.textMuted,
  },
  fieldValue: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: "600",
    color: DebtorRegistryPalette.textPrimary,
  },
});
