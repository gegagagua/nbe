import { StyleSheet } from "react-native";

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from "@/constants/debtor-registry";
import { Space, Typography } from "@/constants/theme";

export const debtorRegistryScreenStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: DebtorRegistryPalette.pageBg,
  },
  body: {
    flex: 1,
    flexDirection: "column",
  },
  scrollPane: {
    flex: 1,
    minHeight: 0,
  },
  contentScroll: {
    flex: 1,
  },
  contentWrap: {
    flexGrow: 1,
    paddingHorizontal: Space.medium,
    paddingVertical: Space.large,
    gap: DebtorRegistryLayout.pageGap,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Space.small,
    paddingHorizontal: Space.extraSmall,
  },
  backButton: {
    padding: Space.extraSmall,
  },
  titleText: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  notifWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: Space.small,
  },
  notifText: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  contentRow: {
    flexGrow: 1,
    gap: DebtorRegistryLayout.pageGap,
  },
  contentRowWeb: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  listWrap: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Space.small,
  },
  pageText: {
    color: DebtorRegistryPalette.textPrimary,
    fontSize: Typography.small,
    fontWeight: "600",
  },
  pageButton: {
    minWidth: 86,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DebtorRegistryPalette.inputBg,
  },
  pageButtonDisabled: {
    opacity: 0.45,
  },
  pageButtonText: {
    color: DebtorRegistryPalette.textPrimary,
    fontSize: Typography.small,
    fontWeight: "700",
  },
  extractDock: {
    paddingHorizontal: Space.large,
    paddingTop: Space.medium,
    paddingBottom: Space.small,
    backgroundColor: DebtorRegistryPalette.cardBg,
    borderTopWidth: 1,
    borderTopColor: DebtorRegistryPalette.panelBorder,
  },
});
