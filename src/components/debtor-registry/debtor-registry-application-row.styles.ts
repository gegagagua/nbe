import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const debtorRegistryApplicationRowStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.cardBorder,
    borderRadius: DebtorRegistryLayout.cardRadius,
    backgroundColor: DebtorRegistryPalette.cardBg,
    padding: Space.medium,
    gap: Space.extraSmall,
  },
  title: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  meta: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textSecondary,
    lineHeight: 18,
  },
});
