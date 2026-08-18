import { ApiConfig } from '@/constants/api';
import { NotificationsPageSize } from '@/constants/notifications';
import { apiClient } from '@/lib/api-client';
import type {
  NotificationsCountUnreadEnvelope,
  NotificationsPage,
  NotificationsSearchFilters,
} from '@/types/notifications';

import { MOCK_NOTIFICATIONS } from './notifications.mock';

export async function getUnreadNotificationsCount() {
  const response = await apiClient.get<NotificationsCountUnreadEnvelope>(
    ApiConfig.notificationsCountUnreadPath,
  );
  return response.data.data;
}

/**
 * Returns a page of notifications.
 *
 * TODO: replace the mock feed with the real endpoint once the backend contract
 * lands — only this function body should need to change.
 */
export async function searchNotifications(
  filters: NotificationsSearchFilters = {},
  pageNumber = 0,
): Promise<NotificationsPage> {
  const readState = filters.readState ?? 'all';
  const matching =
    readState === 'all'
      ? MOCK_NOTIFICATIONS
      : MOCK_NOTIFICATIONS.filter((item) => item.isRead === (readState === 'read'));

  const start = pageNumber * NotificationsPageSize;
  return {
    data: matching.slice(start, start + NotificationsPageSize),
    totalPages: Math.max(1, Math.ceil(matching.length / NotificationsPageSize)),
    totalRecords: matching.length,
  };
}
