import { StyleSheet } from 'react-native';

import { CaseCardPalette } from '@/constants/case-card';
import { DebtorRegistryTypography } from '@/constants/debtor-registry';
import { Space, Typography } from '@/constants/theme';

export const casePaginationStyles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginTop: Space.large,
    paddingBottom: Space.small,
    gap: Space.small,
    alignItems: 'center',
  },
  totalRecords: {
    fontSize: Typography.small,
    fontWeight: '600',
    color: CaseCardPalette.headline,
  },
  navRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.small,
  },
  edgeBtn: {
    paddingHorizontal: Space.small,
    paddingVertical: Space.small,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CaseCardPalette.paginationOutline,
    backgroundColor: CaseCardPalette.paginationMutedBg,
    minWidth: 44,
    alignItems: 'center',
  },
  edgeBtnDisabled: {
    opacity: 0.45,
  },
  edgeBtnText: {
    fontSize: DebtorRegistryTypography.small,
    fontWeight: '700',
    color: CaseCardPalette.headline,
  },
  pageBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CaseCardPalette.paginationOutline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CaseCardPalette.paginationMutedBg,
  },
  pageBtnActive: {
    backgroundColor: CaseCardPalette.paginationActiveBg,
    borderColor: CaseCardPalette.paginationActiveBg,
  },
  pageBtnText: {
    fontSize: DebtorRegistryTypography.small,
    fontWeight: '700',
    color: CaseCardPalette.headline,
  },
  pageBtnTextActive: {
    color: CaseCardPalette.paginationActiveText,
  },
  pageIndicator: {
    fontSize: Typography.small,
    fontWeight: '600',
    color: CaseCardPalette.bureauMuted,
    marginHorizontal: Space.small,
  },
});
