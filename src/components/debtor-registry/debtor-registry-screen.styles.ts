import { Platform, StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { LoginLayout } from '@/constants/login';
import { FontSize, Spacing } from '@/constants/theme';

export const debtorRegistryScreenStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: DebtorRegistryPalette.pageBg,
  },
  body: {
    flex: 1,
  },
  contentScroll: {
    flex: 1,
  },
  contentWrap: {
    flexGrow: 1,
    paddingHorizontal: LoginLayout.horizontalInset,
    paddingVertical: LoginLayout.cardPadding,
    gap: DebtorRegistryLayout.pageGap,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.one,
  },
  titleText: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  notifWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  notifText: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  contentRow: {
    flexGrow: 1,
    gap: DebtorRegistryLayout.pageGap,
  },
  contentRowWeb: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listWrap: {
    flex: 1,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  pageText: {
    color: DebtorRegistryPalette.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  pageButton: {
    minWidth: 86,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DebtorRegistryPalette.inputBg,
  },
  pageButtonDisabled: {
    opacity: 0.45,
  },
  pageButtonText: {
    color: DebtorRegistryPalette.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
