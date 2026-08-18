import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { FontSize, Radius, Space } from '@/constants/theme';

export const NotificationsPalette = {
  pageBg: DebtorRegistryPalette.pageBg,
  cardBg: DebtorRegistryPalette.cardBg,
  /** unread rows get a darker outline so they read as "new" */
  cardBorderUnread: '#c4d0e5',
  cardBorderRead: '#e5e9f2',
  textPrimary: DebtorRegistryPalette.textPrimary,
  textMuted: DebtorRegistryPalette.textMuted,
  selectBorder: DebtorRegistryPalette.inputBorder,
  selectBg: DebtorRegistryPalette.inputBg,
  sheetScrim: 'rgba(15, 23, 42, 0.35)',
  sheetSelectedBg: '#eef2f7',
} as const;

export const NotificationsLayout = {
  panelRadius: Radius.medium,
  panelPadding: Space.medium,
  cardRadius: Radius.small,
  cardPadding: Space.medium,
  listGap: Space.small,
  selectHeight: 48,
  selectRadius: Radius.small,
  filterIconSize: FontSize.xxl,
  chevronSize: FontSize.xxl,
  sheetRadius: Radius.large,
} as const;

export const NotificationsTypography = {
  filterTitle: FontSize.xl,
  cardTitle: FontSize.md,
  cardDate: FontSize.md,
  cardCase: FontSize.md,
  cardBody: FontSize.md,
} as const;

/** Page size used by the (mock, for now) notifications search. */
export const NotificationsPageSize = 20;
