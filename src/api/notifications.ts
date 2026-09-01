import { ApiConfig, NotificationsApiPaths } from '@/constants/api';
import { NotificationsFetchSize } from '@/constants/notifications';
import { apiClient } from '@/lib/api-client';
import { mapNotification } from '@/lib/map-notifications-response';
import type {
  AppNotification,
  NotificationsCountUnreadEnvelope,
  NotificationsSearchEnvelope,
  NotificationsSearchRequest,
} from '@/types/notifications';

export async function getUnreadNotificationsCount() {
  const response = await apiClient.get<NotificationsCountUnreadEnvelope>(
    ApiConfig.notificationsCountUnreadPath,
  );
  return response.data.data;
}

/**
 * Fetches the notifications feed from `POST /notif-portal/v1/notifications/search`.
 *
 * The endpoint filters server-side by `regnumber` / `createdDate*` only — it has
 * no read-state filter — so the whole window is returned and the read/unread
 * split is done client-side (see {@link useNotifications}).
 */
export async function fetchNotifications(): Promise<AppNotification[]> {
  const body: NotificationsSearchRequest = {
    data: {},
    page: { number: 0, size: NotificationsFetchSize },
    sort: [{ property: 'createdDate', direction: 'DESC' }],
  };
  const response = await apiClient.post<NotificationsSearchEnvelope>(
    NotificationsApiPaths.search,
    body,
  );
  return (response.data.data ?? []).map(mapNotification);
}

/**
 * Marks the given notifications as read via
 * `PUT /notif-portal/v1/notifications/mark-as-read` (body: `{ data: [ids] }`).
 */
export async function markNotificationsRead(ids: number[]): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  await apiClient.put(NotificationsApiPaths.markAsRead, { data: ids });
}

/** Marks every currently-unread notification as read. */
export async function markAllNotificationsRead(): Promise<void> {
  const all = await fetchNotifications();
  const unreadIds = all.filter((item) => !item.isRead).map((item) => item.id);
  await markNotificationsRead(unreadIds);
}
