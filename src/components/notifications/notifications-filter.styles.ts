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
  track: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: NotificationsLayout.segmentTrackHeight,
    padding: NotificationsLayout.segmentTrackPadding,
    borderWidth: 1,
    borderColor: NotificationsPalette.segmentTrackBorder,
    borderRadius: NotificationsLayout.segmentTrackRadius,
    backgroundColor: NotificationsPalette.segmentTrackBg,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.extraSmall,
    borderRadius: NotificationsLayout.segmentRadius,
  },
  segmentActive: {
    backgroundColor: NotificationsPalette.segmentActiveBg,
  },
  segmentLabel: {
    fontSize: NotificationsTypography.segmentLabel,
    fontWeight: '500',
    color: NotificationsPalette.segmentInactiveText,
  },
  segmentLabelActive: {
    fontWeight: '700',
    color: NotificationsPalette.segmentActiveText,
  },
});
