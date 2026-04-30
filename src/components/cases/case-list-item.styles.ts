import { Platform, StyleSheet } from "react-native";

import { CaseCardPalette } from "@/constants/case-card";
import {
  DebtorRegistryLayout,
  DebtorRegistryTypography,
} from "@/constants/debtor-registry";
import { FontSize, Spacing } from "@/constants/theme";

export const caseListItemStyles = StyleSheet.create({
  press: {
    width: "100%",
  },
  card: {
    borderWidth: 1,
    borderColor: CaseCardPalette.cardBorder,
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
  cardAccent: {
    borderLeftWidth: 4,
  },
  topBlock: {
    marginBottom: Spacing.two,
  },
  sequence: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.sequenceMuted,
    fontWeight: "600",
    marginBottom: Spacing.half,
  },
  caseNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: CaseCardPalette.headline,
    marginTop: Spacing.half,
  },
  caseDate: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.bureauMuted,
    marginTop: Spacing.half,
  },
  caseTitle: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.headline,
    marginTop: Spacing.one,
    lineHeight: 18,
  },
  bureau: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.bureauMuted,
    marginTop: Spacing.one,
  },
  partiesRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  partyBox: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: CaseCardPalette.partyBoxBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: CaseCardPalette.partyBoxBg,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  partyLabel: {
    fontSize: DebtorRegistryTypography.small,
    fontWeight: "700",
    color: CaseCardPalette.bureauMuted,
  },
  partyLine: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.headline,
    fontWeight: "600",
  },
  debtRow: {
    marginTop: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CaseCardPalette.divider,
  },
  debtLineInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: Spacing.one,
  },
  debtLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: CaseCardPalette.headline,
  },
  debtValue: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: CaseCardPalette.headline,
  },
});
