import { StyleSheet } from "react-native";

import { Space } from "@/constants/theme";

export const homeDashboardLayoutStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingHorizontal: Space.large,
    paddingVertical: Space.large,
    flexGrow: 1,
  },
});
