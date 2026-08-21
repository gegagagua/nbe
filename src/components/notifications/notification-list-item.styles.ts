import { StyleSheet } from 'react-native';

import {
  NotificationsLayout,
  NotificationsPalette,
  NotificationsTypography,
} from '@/constants/notifications';
import { Space } from '@/constants/theme';

export const notificationListItemStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.small,
    backgroundColor: NotificationsPalette.cardBg,
    borderWidth: 1,
    borderColor: NotificationsPalette.cardBorderRead,
    borderRadius: NotificationsLayout.cardRadius,
    padding: NotificationsLayout.cardPadding,
  },
  cardUnread: {
    borderColor: NotificationsPalette.cardBorderUnread,
  },
  cardSelected: {
    backgroundColor: NotificationsPalette.cardSelectedBg,
  },
  checkbox: {
    paddingTop: 1,
  },
  content: {
    flex: 1,
    gap: Space.extraSmall,
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
