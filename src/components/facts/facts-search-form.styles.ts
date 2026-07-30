import { StyleSheet } from "react-native";

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
} from "@/constants/debtor-registry";
import { LoginPalette } from "@/constants/login";
import { Spacing } from "@/constants/theme";

export const factsSearchFormStyles = StyleSheet.create({
  actions: {
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  searchButton: {
    height: DebtorRegistryLayout.inputHeight,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.buttonBg,
    alignItems: "center",
    justifyContent: "center",
  },
  searchText: {
    color: DebtorRegistryPalette.buttonText,
    fontWeight: "700",
  },
  clearButton: {
    height: DebtorRegistryLayout.inputHeight,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: LoginPalette.logoRed,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    color: LoginPalette.onPrimary,
    fontWeight: "700",
  },
});
