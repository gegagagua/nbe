import { useQuery } from '@tanstack/react-query';

import { getUnreadNotificationsCount } from '@/api/notifications';

const UNREAD_NOTIFICATIONS_QUERY_KEY = ['notifications', 'count-unread'] as const;

export function useUnreadNotificationsCount(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY,
    queryFn: getUnreadNotificationsCount,
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: options?.enabled ?? true,
  });

  return {
    count: query.data ?? 0,
    isLoading: query.isLoading,
  };
}
