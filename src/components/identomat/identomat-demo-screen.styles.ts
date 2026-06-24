import { StyleSheet } from "react-native";

import { LoginPalette } from "@/constants/login";
import { Radius, Space, Typography } from "@/constants/theme";

export const identomatDemoScreenStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: LoginPalette.pageBackground,
  },
  safe: {
    flex: 1,
  },
  navRow: {
    alignSelf: "stretch",
    marginBottom: Space.small,
    paddingHorizontal: 0,
  },
  hit: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Space.extraSmall,
    // paddingRight: Space.medium,
  },
  backLabel: {
    color: LoginPalette.primary,
    fontSize: Typography.medium,
    fontWeight: "600",
  },
  webviewWrap: {
    flex: 1,
    marginHorizontal: 0,
    marginBottom: Space.large,
    borderRadius: Radius.small,
    // overflow: "hidden",
    // backgroundColor: LoginPalette.cardBackground,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LoginPalette.cardBackground,
  },
});
