import { StyleSheet } from "react-native";

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from "@/constants/debtor-registry";
import { Space } from "@/constants/theme";

export const caseScreenStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: DebtorRegistryPalette.pageBg,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Space.medium,
    paddingTop: Space.large,
    paddingBottom: Space.extraLarge,
    gap: DebtorRegistryLayout.pageGap,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  notifWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: Space.small,
    marginBottom: Space.small,
  },
  notifText: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  listWrap: {
    width: "100%",
  },
});
