import { StyleSheet } from "react-native";

import { HomeDashboardPalette } from "@/constants/home-dashboard";

export const homeTabContentShellStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: HomeDashboardPalette.pageBg,
  },
  body: {
    flex: 1,
  },
});
