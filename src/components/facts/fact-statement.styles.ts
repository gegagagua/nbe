import { StyleSheet } from "react-native";

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from "@/constants/debtor-registry";
import { Space } from "@/constants/theme";

export const factStatementStyles = StyleSheet.create({
  radioList: {
    gap: Space.small,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Space.small,
    paddingVertical: Space.small,
    paddingHorizontal: Space.medium,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.cardBorder,
    backgroundColor: DebtorRegistryPalette.inputBg,
  },
  radioRowSelected: {
    borderColor: DebtorRegistryPalette.textPrimary,
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  radioLabel: {
    flex: 1,
    fontSize: DebtorRegistryTypography.input,
    color: DebtorRegistryPalette.textPrimary,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Space.small,
  },
  timeCol: {
    flex: 1,
    gap: Space.extraSmall,
  },
  timeClear: {
    alignSelf: "flex-start",
    paddingVertical: Space.small,
    paddingHorizontal: Space.medium,
  },
  timeClearText: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  reviewRow: {
    gap: Space.extraSmall,
  },
  reviewLabel: {
    fontSize: DebtorRegistryTypography.label,
    color: DebtorRegistryPalette.textMuted,
  },
  reviewValue: {
    fontSize: DebtorRegistryTypography.input,
    fontWeight: "600",
    color: DebtorRegistryPalette.textPrimary,
  },
});
