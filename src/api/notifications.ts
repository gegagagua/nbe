import { ApiConfig } from '@/constants/api';
import { apiClient } from '@/lib/api-client';
import type { NotificationsCountUnreadEnvelope } from '@/types/notifications';

export async function getUnreadNotificationsCount() {
  const response = await apiClient.get<NotificationsCountUnreadEnvelope>(
    ApiConfig.notificationsCountUnreadPath,
  );
  return response.data.data;
}
