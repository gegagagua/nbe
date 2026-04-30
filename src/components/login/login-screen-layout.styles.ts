import { StyleSheet } from "react-native";

import { LoginPalette } from "@/constants/login";
import { Space, Spacing, Typography } from "@/constants/theme";

export const loginScreenLayoutStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: LoginPalette.pageBackground,
  },
  body: {
    flex: 1,
  },
  titleWrap: {
    position: "relative",
    marginTop: Space.large,
    marginBottom: Space.medium,
    paddingHorizontal: Space.large,
    minHeight: Typography.extraLarge + Space.small,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    paddingLeft: Space.large,
    paddingRight: Spacing.four + Spacing.five + Spacing.three,
    fontSize: Typography.extraLarge,
    fontWeight: "700",
    color: LoginPalette.titleText,
  },
  langSlot: {
    position: "absolute",
    right: Space.large,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Space.large,
  },
  centerTop: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: Space.medium,
    paddingHorizontal: Space.large,
  },
});
