import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const caseDetailInternalStyles = StyleSheet.create({
  headerBlock: {
    gap: Space.small,
    marginBottom: Space.medium,
  },
  headerStack: {
    flex: 1,
    gap: Space.extraSmall,
  },
  bureauIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.extraSmall,
  },
  caseNo: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  bureauRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.small,
  },
  categoryRight: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textSecondary,
    textAlign: 'right',
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
    marginBottom: Space.medium,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: Space.small,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: DebtorRegistryPalette.buttonBg,
  },
  tabLabel: {
    fontSize: DebtorRegistryTypography.label,
    color: DebtorRegistryPalette.textSecondary,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: DebtorRegistryPalette.buttonBg,
    fontWeight: '700',
  },
  primaryText: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  mutedText: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textSecondary,
  },
  paymentId: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textSecondary,
    marginTop: Space.extraSmall,
  },
  claimsTableWrap: {
    marginTop: Space.small,
  },
  stackGapSm: {
    marginTop: Space.small,
  },
  linkText: {
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.buttonBg,
    textDecorationLine: 'underline',
  },
  fileRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.small,
  },
  fileInfo: {
    flex: 1,
    gap: Space.extraSmall,
  },
});
