import { StyleSheet } from 'react-native';

import {
  NotificationsLayout,
  NotificationsPalette,
  NotificationsTypography,
} from '@/constants/notifications';
import { Space } from '@/constants/theme';

export const notificationListItemStyles = StyleSheet.create({
  card: {
    backgroundColor: NotificationsPalette.cardBg,
    borderWidth: 1,
    borderColor: NotificationsPalette.cardBorderRead,
    borderRadius: NotificationsLayout.cardRadius,
    padding: NotificationsLayout.cardPadding,
    gap: Space.extraSmall,
  },
  cardUnread: {
    borderColor: NotificationsPalette.cardBorderUnread,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.small,
  },
  title: {
    flex: 1,
    fontSize: NotificationsTypography.cardTitle,
    fontWeight: '400',
    color: NotificationsPalette.textPrimary,
  },
  titleUnread: {
    fontWeight: '700',
  },
  date: {
    fontSize: NotificationsTypography.cardDate,
    fontWeight: '400',
    color: NotificationsPalette.textPrimary,
  },
  dateUnread: {
    fontWeight: '700',
  },
  caseNumber: {
    fontSize: NotificationsTypography.cardCase,
    fontWeight: '400',
    color: NotificationsPalette.textPrimary,
  },
  caseNumberUnread: {
    fontWeight: '700',
  },
  body: {
    fontSize: NotificationsTypography.cardBody,
    color: NotificationsPalette.textMuted,
  },
});
