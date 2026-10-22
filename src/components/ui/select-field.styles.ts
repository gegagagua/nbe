import { StyleSheet } from "react-native";

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
} from "@/constants/debtor-registry";
import { LoginPalette } from "@/constants/login";
import { Spacing } from "@/constants/theme";

export const selectFieldStyles = StyleSheet.create({
  field: {
    minHeight: DebtorRegistryLayout.inputHeight,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.inputBg,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  fieldText: {
    flex: 1,
    color: DebtorRegistryPalette.textPrimary,
  },
  placeholder: {
    flex: 1,
    color: LoginPalette.placeholderMuted,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    maxHeight: "70%",
    backgroundColor: DebtorRegistryPalette.cardBg,
    borderRadius: DebtorRegistryLayout.modalRadius,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  navBtn: {
    padding: Spacing.one,
    borderRadius: DebtorRegistryLayout.buttonRadius,
  },
  option: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  optionSelected: {
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: DebtorRegistryPalette.textPrimary,
  },
  optionTextSelected: {
    fontWeight: "700",
  },
});
