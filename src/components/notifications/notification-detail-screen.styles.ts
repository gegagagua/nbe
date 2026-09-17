import { StyleSheet } from 'react-native';

import {
  NotificationsLayout,
  NotificationsPalette,
  NotificationsTypography,
} from '@/constants/notifications';
import { FontSize, LineHeight, Space } from '@/constants/theme';

export const notificationDetailStyles = StyleSheet.create({
  card: {
    backgroundColor: NotificationsPalette.cardBg,
    borderWidth: 1,
    borderColor: NotificationsPalette.cardBorderRead,
    borderRadius: NotificationsLayout.cardRadius,
    padding: NotificationsLayout.cardPadding,
    gap: Space.small,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.small,
  },
  module: {
    flex: 1,
    fontSize: NotificationsTypography.cardModule,
    color: NotificationsPalette.textMuted,
  },
  title: {
    fontSize: NotificationsTypography.filterTitle,
    fontWeight: '700',
    color: NotificationsPalette.textPrimary,
  },
  date: {
    fontSize: NotificationsTypography.cardDate,
    color: NotificationsPalette.textMuted,
  },
  body: {
    fontSize: FontSize.md,
    lineHeight: LineHeight.comfortable,
    color: NotificationsPalette.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: NotificationsPalette.cardBorderRead,
    marginVertical: Space.extraSmall,
  },
  caseLabel: {
    fontSize: FontSize.sm,
    color: NotificationsPalette.textMuted,
  },
  caseLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.extraSmall,
    alignSelf: 'flex-start',
  },
  caseLinkText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: NotificationsPalette.segmentActiveBg,
    textDecorationLine: 'underline',
  },
  stateText: {
    fontSize: FontSize.md,
    color: NotificationsPalette.textMuted,
    textAlign: 'center',
    paddingVertical: Space.large,
  },
});
