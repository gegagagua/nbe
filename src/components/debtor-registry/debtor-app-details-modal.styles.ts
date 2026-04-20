import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Spacing } from '@/constants/theme';

export const debtorAppDetailsModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
  },
  panel: {
    width: '100%',
    maxWidth: 900,
    maxHeight: '92%',
    borderRadius: DebtorRegistryLayout.modalRadius,
    backgroundColor: DebtorRegistryPalette.pageBg,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.cardBorder,
  },
  title: {
    color: DebtorRegistryPalette.textPrimary,
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
  },
  close: {
    color: DebtorRegistryPalette.textSecondary,
    fontSize: DebtorRegistryTypography.title,
    paddingHorizontal: Spacing.one,
  },
  statementWrap: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'flex-end',
  },
  statementText: {
    color: DebtorRegistryPalette.buttonBg,
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
  },
  body: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sectionTitle: {
    color: DebtorRegistryPalette.textPrimary,
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.inputBg,
    padding: Spacing.two,
  },
  label: {
    color: DebtorRegistryPalette.textMuted,
    fontSize: DebtorRegistryTypography.small,
  },
  value: {
    color: DebtorRegistryPalette.textPrimary,
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '600',
    marginTop: Spacing.half,
  },
});
