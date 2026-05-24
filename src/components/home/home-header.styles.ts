import { StyleSheet } from "react-native";

import {
  HomeDashboardLayoutConst,
  HomeDashboardPalette,
} from "@/constants/home-dashboard";
import { LetterSpacing } from "@/constants/letter-spacing";
import { LoginPalette } from "@/constants/login";
import { LineHeight, Space, Typography } from "@/constants/theme";

export const homeHeaderStyles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: HomeDashboardPalette.headerBg,
    paddingVertical: HomeDashboardLayoutConst.headerPaddingV,
    paddingHorizontal: Space.large,
  },
  logoWrap: {
    flexShrink: 1,
    maxWidth: "72%",
    paddingVertical: Space.extraSmall,
    paddingRight: Space.small,
  },
  logoGeo: {
    color: HomeDashboardPalette.headerText,
    fontSize: Typography.extraSmall * 0.85,
    fontWeight: "600",
    lineHeight: 15,
  },
  logoDivider: {
    height: 1,
    alignSelf: "stretch",
    backgroundColor: LoginPalette.logoRed,
    marginVertical: Space.extraSmall,
  },
  logoEn: {
    color: HomeDashboardPalette.headerText,
    fontSize: Typography.extraSmall * 0.85,
    fontWeight: "700",
    letterSpacing: LetterSpacing.headerLogoEn,
    textTransform: "uppercase",
    lineHeight: 14,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Space.small,
  },
  actionPress: {
    alignItems: "center",
    justifyContent: "center",
    padding: Space.small,
  },
  profileWrap: {
    position: "relative",
  },
  badgeWrap: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});
