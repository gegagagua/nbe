import { StyleSheet } from "react-native";

import {
  HomeDashboardLayoutConst,
  HomeDashboardPalette,
} from "@/constants/home-dashboard";
import { Space } from "@/constants/theme";

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
    paddingVertical: Space.extraSmall,
    paddingRight: Space.small,
  },
  logoImage: {
    width: 44,
    height: 44,
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
