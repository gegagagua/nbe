import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { FontSize, Radius, Space } from '@/constants/theme';

export const NotificationsPalette = {
  pageBg: DebtorRegistryPalette.pageBg,
  cardBg: DebtorRegistryPalette.cardBg,
  /** unread rows get a darker outline so they read as "new" */
  cardBorderUnread: '#c4d0e5',
  cardBorderRead: '#e5e9f2',
  /** background of a row picked with the selection checkbox */
  cardSelectedBg: '#eaf1fb',
  textPrimary: DebtorRegistryPalette.textPrimary,
  textMuted: DebtorRegistryPalette.textMuted,
  segmentTrackBg: DebtorRegistryPalette.panelBg,
  segmentTrackBorder: DebtorRegistryPalette.inputBorder,
  segmentActiveBg: DebtorRegistryPalette.buttonBg,
  segmentActiveText: DebtorRegistryPalette.buttonText,
  segmentInactiveText: DebtorRegistryPalette.textSecondary,
  toolbarBorder: DebtorRegistryPalette.inputBorder,
  menuBg: DebtorRegistryPalette.cardBg,
  menuBorder: DebtorRegistryPalette.cardBorder,
  menuHeaderText: DebtorRegistryPalette.textMuted,
  menuShadow: '#0f172a',
  actionDisabledText: DebtorRegistryPalette.textMuted,
} as const;

export const NotificationsLayout = {
  panelRadius: Radius.medium,
  panelPadding: Space.medium,
  cardRadius: Radius.small,
  cardPadding: Space.medium,
  listGap: Space.small,
  segmentTrackHeight: 44,
  segmentTrackPadding: Space.extraSmall,
  segmentTrackRadius: Radius.small,
  segmentRadius: Radius.extraSmall,
  filterIconSize: FontSize.xxl,
  checkboxSize: FontSize.xxl,
  toolbarToggleHeight: 36,
  toolbarRadius: Radius.small,
  menuRadius: Radius.small,
  menuMinWidth: 180,
  menuOffset: Space.extraSmall,
} as const;

export const NotificationsTypography = {
  filterTitle: FontSize.xl,
  segmentLabel: FontSize.md,
  menuHeader: FontSize.md,
  menuItem: FontSize.md,
  actionLabel: FontSize.md,
  cardModule: FontSize.sm,
  cardTitle: FontSize.md,
  cardDate: FontSize.sm,
  cardCase: FontSize.md,
  cardBody: FontSize.md,
} as const;

/** Rows rendered per page in the feed (client-side pagination). */
export const NotificationsPageSize = 20;

/**
 * How many rows we pull from the server in one search call. The read/unread
 * filter is applied client-side (the backend `search` ignores a `read` field),
 * so we fetch a generous window and paginate locally.
 */
export const NotificationsFetchSize = 100;
