import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const caseDetailScreenStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: DebtorRegistryPalette.pageBg,
  },
  scroll: {
    padding: Space.medium,
    paddingBottom: Space.extraLarge,
    gap: Space.medium,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.small,
  },
  backBtn: {
    paddingVertical: Space.small,
    paddingHorizontal: Space.small,
  },
  backText: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.buttonBg,
  },
  title: {
    flex: 1,
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  section: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
    borderRadius: DebtorRegistryLayout.panelRadius,
    backgroundColor: DebtorRegistryPalette.cardBg,
    padding: Space.medium,
    gap: Space.small,
  },
  sectionTitle: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  sectionBody: {
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.textSecondary,
    lineHeight: 20,
  },
});
