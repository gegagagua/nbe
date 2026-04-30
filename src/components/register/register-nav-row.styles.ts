import { StyleSheet } from "react-native";

import { LoginPalette } from "@/constants/login";
import { Space, Typography } from "@/constants/theme";

export const registerNavRowStyles = StyleSheet.create({
  row: {
    alignSelf: "stretch",
    marginBottom: Space.medium,
  },
  hit: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Space.extraSmall,
    paddingRight: Space.medium,
  },
  backLabel: {
    color: LoginPalette.primary,
    fontSize: Typography.medium,
    fontWeight: "600",
  },
});
