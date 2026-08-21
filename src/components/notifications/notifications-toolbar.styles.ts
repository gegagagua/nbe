import { Platform, StyleSheet } from 'react-native';

import {
  NotificationsLayout,
  NotificationsPalette,
  NotificationsTypography,
} from '@/constants/notifications';
import { Space } from '@/constants/theme';

export const notificationsToolbarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.small,
  },
  toggle: {
    height: NotificationsLayout.toolbarToggleHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.extraSmall,
    paddingHorizontal: Space.small,
    borderWidth: 1,
    borderColor: NotificationsPalette.toolbarBorder,
    borderRadius: NotificationsLayout.toolbarRadius,
    backgroundColor: NotificationsPalette.cardBg,
  },
  action: {
    height: NotificationsLayout.toolbarToggleHeight,
    justifyContent: 'center',
    paddingHorizontal: Space.small,
  },
  actionLabel: {
    fontSize: NotificationsTypography.actionLabel,
    fontWeight: '600',
    color: NotificationsPalette.textPrimary,
  },
  actionLabelDisabled: {
    color: NotificationsPalette.actionDisabledText,
  },
  menuScrim: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    minWidth: NotificationsLayout.menuMinWidth,
    paddingVertical: Space.extraSmall,
    backgroundColor: NotificationsPalette.menuBg,
    borderWidth: 1,
    borderColor: NotificationsPalette.menuBorder,
    borderRadius: NotificationsLayout.menuRadius,
    ...Platform.select({
      android: { elevation: 6 },
      default: {
        shadowColor: NotificationsPalette.menuShadow,
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },
  menuHeader: {
    paddingVertical: Space.small,
    paddingHorizontal: Space.medium,
    fontSize: NotificationsTypography.menuHeader,
    color: NotificationsPalette.menuHeaderText,
  },
  menuItem: {
    paddingVertical: Space.small,
    paddingHorizontal: Space.medium,
  },
  menuItemText: {
    fontSize: NotificationsTypography.menuItem,
    color: NotificationsPalette.textPrimary,
  },
});
