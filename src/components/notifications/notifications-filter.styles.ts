import { StyleSheet } from 'react-native';

import {
  NotificationsLayout,
  NotificationsPalette,
  NotificationsTypography,
} from '@/constants/notifications';
import { Space } from '@/constants/theme';

export const notificationsFilterStyles = StyleSheet.create({
  panel: {
    backgroundColor: NotificationsPalette.cardBg,
    borderRadius: NotificationsLayout.panelRadius,
    padding: NotificationsLayout.panelPadding,
    gap: Space.medium,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.small,
  },
  title: {
    fontSize: NotificationsTypography.filterTitle,
    fontWeight: '600',
    color: NotificationsPalette.textPrimary,
  },
  select: {
    height: NotificationsLayout.selectHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.medium,
    borderWidth: 1,
    borderColor: NotificationsPalette.selectBorder,
    borderRadius: NotificationsLayout.selectRadius,
    backgroundColor: NotificationsPalette.selectBg,
  },
  selectText: {
    fontSize: NotificationsTypography.filterTitle,
    color: NotificationsPalette.textPrimary,
  },
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: NotificationsPalette.sheetScrim,
  },
  sheet: {
    backgroundColor: NotificationsPalette.cardBg,
    borderTopLeftRadius: NotificationsLayout.sheetRadius,
    borderTopRightRadius: NotificationsLayout.sheetRadius,
    paddingVertical: Space.small,
  },
  option: {
    paddingVertical: Space.medium,
    paddingHorizontal: Space.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: NotificationsPalette.sheetSelectedBg,
  },
  optionText: {
    fontSize: NotificationsTypography.filterTitle,
    color: NotificationsPalette.textPrimary,
  },
  optionTextSelected: {
    fontWeight: '700',
  },
});
