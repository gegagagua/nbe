import { StyleSheet } from 'react-native';

import { DebtorRegistryLayout, DebtorRegistryPalette, DebtorRegistryTypography } from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const debtorExtractPaymentStyles = StyleSheet.create({
  feeCard: {
    backgroundColor: DebtorRegistryPalette.panelBg,
    borderRadius: DebtorRegistryLayout.cardRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.textPrimary,
    padding: Space.large,
    alignItems: 'center',
    gap: Space.extraSmall,
  },
  feeLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: DebtorRegistryPalette.textSecondary,
  },
  feeAmount: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '800',
    color: DebtorRegistryPalette.textPrimary,
  },
  methodsTitle: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  methodPress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.medium,
    padding: Space.medium,
    borderRadius: DebtorRegistryLayout.cardRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.cardBorder,
    backgroundColor: DebtorRegistryPalette.cardBg,
  },
  methodPressSelected: {
    borderColor: DebtorRegistryPalette.textPrimary,
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  methodLabel: {
    flex: 1,
    fontSize: DebtorRegistryTypography.input,
    fontWeight: '600',
    color: DebtorRegistryPalette.textPrimary,
  },
  summaryCard: {
    backgroundColor: DebtorRegistryPalette.panelBg,
    borderRadius: DebtorRegistryLayout.cardRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
    padding: Space.medium,
    gap: Space.medium,
  },
  summaryRow: {
    gap: Space.extraSmall,
  },
  summaryLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: DebtorRegistryPalette.textSecondary,
  },
  summaryValue: {
    fontSize: DebtorRegistryTypography.input,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
});
