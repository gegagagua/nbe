import { StyleSheet } from "react-native";

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
} from "@/constants/debtor-registry";
import { LoginPalette } from "@/constants/login";
import { Spacing } from "@/constants/theme";

export const datePickerFieldStyles = StyleSheet.create({
  field: {
    height: DebtorRegistryLayout.inputHeight,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.inputBg,
    paddingHorizontal: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldText: {
    color: DebtorRegistryPalette.textPrimary,
  },
  placeholder: {
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
    maxWidth: 340,
    backgroundColor: DebtorRegistryPalette.cardBg,
    borderRadius: DebtorRegistryLayout.modalRadius,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: DebtorRegistryPalette.textPrimary,
  },
  navBtn: {
    padding: Spacing.one,
    borderRadius: DebtorRegistryLayout.buttonRadius,
  },
  weekRow: {
    flexDirection: "row",
  },
  weekCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.one,
  },
  weekText: {
    fontSize: 12,
    fontWeight: "600",
    color: DebtorRegistryPalette.textMuted,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: LoginPalette.logoRed,
  },
  dayText: {
    color: DebtorRegistryPalette.textPrimary,
  },
  daySelectedText: {
    color: LoginPalette.onPrimary,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.four,
    marginTop: Spacing.one,
  },
  footerBtn: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  footerText: {
    color: DebtorRegistryPalette.textPrimary,
    fontWeight: "600",
  },
  footerClear: {
    color: LoginPalette.logoRed,
    fontWeight: "700",
  },
});
