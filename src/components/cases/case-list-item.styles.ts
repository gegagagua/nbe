import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Spacing } from '@/constants/theme';

export const caseListItemStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.cardBorder,
    borderRadius: DebtorRegistryLayout.cardRadius,
    backgroundColor: DebtorRegistryPalette.cardBg,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  left: {
    flex: 2,
    gap: Spacing.half,
  },
  right: {
    flex: 2,
    flexDirection: 'row',
    gap: Spacing.one,
  },
  partyBox: {
    flex: 1,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.panelBg,
    padding: Spacing.one + Spacing.half,
  },
  prefix: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  text: {
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.textSecondary,
  },
  partyTitle: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textMuted,
  },
  partyText: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textPrimary,
    fontWeight: '600',
  },
});
