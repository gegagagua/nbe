import { StyleSheet } from "react-native";

import { LoginPalette } from "@/constants/login";
import { Radius, Space, Typography } from "@/constants/theme";

export const registerSegmentedTabsStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Space.extraSmall,
    marginBottom: Space.medium,
  },
  tab: {
    flex: 1,
    paddingVertical: Space.extraSmall,
    borderRadius: Radius.small,
    borderWidth: 1,
    borderColor: LoginPalette.inputBorder,
    backgroundColor: LoginPalette.inputFill,
    alignItems: "center",
  },
  tabSelected: {
    backgroundColor: LoginPalette.primary,
    borderColor: LoginPalette.primary,
  },
  tabLabel: {
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    paddingVertical: Space.small,
    textAlign: "center",
  },
  tabLabelSelected: {
    color: LoginPalette.onPrimary,
    fontWeight: "600",
  },
});
