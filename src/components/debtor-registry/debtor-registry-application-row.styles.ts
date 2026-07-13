import { Platform, StyleSheet } from 'react-native';

import { CaseCardPalette } from '@/constants/case-card';
import {
  DebtorRegistryLayout,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Spacing } from '@/constants/theme';

export const debtorRegistryApplicationRowStyles = StyleSheet.create({
  press: {
    width: '100%',
  },
  // Same visual language as the cases card (case-list-item.styles), but with a
  // uniform gap between every line so spacing stays even.
  card: {
    borderWidth: 1,
    borderColor: CaseCardPalette.cardBorder,
    borderRadius: DebtorRegistryLayout.cardRadius,
    backgroundColor: CaseCardPalette.cardBg,
    borderLeftWidth: 4,
    padding: Spacing.three,
    gap: Spacing.two,
    ...Platform.select({
      ios: {
        shadowColor: '#1e2a3d',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  caseNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: CaseCardPalette.headline,
  },
  caseDate: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.bureauMuted,
  },
  applicantLine: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.headline,
    fontWeight: '600',
  },
  requestedBox: {
    marginTop: Spacing.two,
    borderWidth: 1,
    borderColor: CaseCardPalette.partyBoxBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: CaseCardPalette.partyBoxBg,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  requestedLabel: {
    fontSize: DebtorRegistryTypography.small,
    fontWeight: '700',
    color: CaseCardPalette.bureauMuted,
  },
  requestedLine: {
    fontSize: DebtorRegistryTypography.small,
    color: CaseCardPalette.headline,
    fontWeight: '600',
  },
});
