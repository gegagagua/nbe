import { StyleSheet } from "react-native";

import { HomeTabsLayout, HomeTabsPalette } from "@/constants/home-tabs";
import { Spacing } from "@/constants/theme";

export const homeNativeTabsStyles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: Spacing.three,
    right: Spacing.three,
    bottom: 0,
    borderRadius: HomeTabsLayout.tabBarRadius,
    backgroundColor: HomeTabsPalette.activeBg,
    paddingHorizontal: Spacing.two,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  tabItem: {
    marginHorizontal: Spacing.one,
    borderRadius: 20,
    overflow: "hidden",
  },
});
