import { StyleSheet } from "react-native";

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from "@/constants/debtor-registry";
import { LineHeight, Space } from "@/constants/theme";

export const factProtocolStyles = StyleSheet.create({
  intro: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textMuted,
    lineHeight: LineHeight.comfortable,
  },
  group: {
    gap: Space.small,
  },
  groupTitle: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  groupHint: {
    fontSize: DebtorRegistryTypography.label,
    color: DebtorRegistryPalette.textMuted,
  },
  emptyLine: {
    fontSize: DebtorRegistryTypography.label,
    color: DebtorRegistryPalette.textMuted,
    fontStyle: "italic",
  },
  fileRow: {
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
  fileInfo: {
    flex: 1,
    gap: Space.extraSmall,
  },
  fileName: {
    fontSize: DebtorRegistryTypography.input,
    color: DebtorRegistryPalette.textPrimary,
  },
  fileMeta: {
    fontSize: DebtorRegistryTypography.label,
    color: DebtorRegistryPalette.textMuted,
  },
});
