import { Platform, StyleSheet } from "react-native";

import { CaseCardPalette } from "@/constants/case-card";
import { LoginPalette } from "@/constants/login";
import {
  DebtorRegistryLayout,
  DebtorRegistryTypography,
} from "@/constants/debtor-registry";
import { FontSize, Spacing } from "@/constants/theme";

export const factsListItemStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: CaseCardPalette.cardBorder,
    borderLeftWidth: 4,
    borderLeftColor: LoginPalette.logoRed,
    borderRadius: DebtorRegistryLayout.cardRadius,
    backgroundColor: CaseCardPalette.cardBg,
    padding: Spacing.three,
    ...Platform.select({
      ios: {
        shadowColor: "#1e2a3d",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  topRow: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  leftCol: {
    flex: 1,
    minWidth: 0,
  },
  rightCol: {
    flexShrink: 0,
    maxWidth: "48%",
  },
  reference: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: LoginPalette.logoRed,
    marginBottom: Spacing.half,
  },
  bureau: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: CaseCardPalette.headline,
  },
  caseLine: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.bureauMuted,
    marginTop: Spacing.half,
  },
  fieldLabel: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.bureauMuted,
  },
  partyLabel: {
    fontSize: DebtorRegistryTypography.small,
    fontWeight: "700",
    color: LoginPalette.primary,
    marginTop: Spacing.one,
  },
  partyValue: {
    fontSize: DebtorRegistryTypography.small,
    fontWeight: "600",
    color: CaseCardPalette.headline,
    marginTop: Spacing.half,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CaseCardPalette.divider,
  },
  statusLabel: {
    fontSize: DebtorRegistryTypography.small,
    fontWeight: "700",
    color: LoginPalette.logoRed,
  },
  statusMuted: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.bureauMuted,
  },
  statusStrong: {
    fontWeight: "700",
    color: CaseCardPalette.headline,
  },
});
