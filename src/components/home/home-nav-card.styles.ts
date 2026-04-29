import { StyleSheet } from "react-native";

import {
    HomeDashboardLayoutConst,
    HomeDashboardPalette,
} from "@/constants/home-dashboard";
import { FontSize, Spacing } from "@/constants/theme";
import type { HomeNavAccent } from "@/types/home-dashboard";

export const navTabBackground: Record<HomeNavAccent, string> = {
  red: HomeDashboardPalette.tabRed,
  slate: HomeDashboardPalette.tabSlate,
  light: HomeDashboardPalette.tabLight,
};

export const homeNavCardStyles = StyleSheet.create({
  wrap: {
    width: "48%",
  },
  card: {
    position: "relative",
    backgroundColor: HomeDashboardPalette.cardBg,
    borderWidth: 1,
    borderColor: HomeDashboardPalette.cardBorder,
    borderRadius: HomeDashboardLayoutConst.cardRadius,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.five,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    minHeight: HomeDashboardLayoutConst.cardMinHeight,
    shadowColor: "#0f172a",
    shadowOffset: {
      width: 0,
      height: HomeDashboardLayoutConst.cardShadowOffsetY,
    },
    shadowOpacity: HomeDashboardLayoutConst.cardShadowOpacity,
    shadowRadius: HomeDashboardLayoutConst.cardShadowRadius,
    elevation: HomeDashboardLayoutConst.cardElevation,
  },
  cardPressed: {
    opacity: HomeDashboardLayoutConst.cardPressedOpacity,
    transform: [{ scale: 0.985 }],
  },
  tabAnchor: {
    position: "absolute",
    top: HomeDashboardLayoutConst.tabAnchorOffset,
    left: 0,
    right: 0,
    height: HomeDashboardLayoutConst.tabHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    width: HomeDashboardLayoutConst.tabWidth,
    height: HomeDashboardLayoutConst.tabHeight,
    borderRadius: HomeDashboardLayoutConst.tabInnerRadius,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    marginTop: Spacing.five,
    textAlign: "center",
    fontSize: FontSize.md,
    fontWeight: "700",
    color: HomeDashboardPalette.titleText,
  },
});
