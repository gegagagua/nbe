import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Spacing } from '@/constants/theme';

export const debtorAppListItemStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.cardBorder,
    borderRadius: DebtorRegistryLayout.cardRadius,
    backgroundColor: DebtorRegistryPalette.cardBg,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  cardPressed: {
    opacity: 0.93,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftTop: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  rightTop: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textSecondary,
  },
  rowText: {
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.textSecondary,
  },
  personBox: {
    marginTop: Spacing.one,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.panelBg,
    padding: Spacing.two,
  },
  personName: {
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.textPrimary,
    fontWeight: '600',
  },
  personAddress: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textMuted,
  },
  detailHint: {
    marginTop: Spacing.one,
    color: DebtorRegistryPalette.buttonBg,
    fontSize: DebtorRegistryTypography.small,
    fontWeight: '700',
    textAlign: 'right',
  },
});
