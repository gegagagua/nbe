import { useQuery } from "@tanstack/react-query";

import { getUnreadNotificationsCount } from "@/api/notifications";
import { isGuestMode } from "@/lib/guest-mode";

/**
 * Reads the unread notifications count from
 * `GET /notif-portal/v1/notifications/count-unread`. Drives the header bell
 * badge and the red counter on the notifications page. Skipped for guests.
 */
export function useUnreadNotificationsCount(options?: { enabled?: boolean }) {
  const enabled = (options?.enabled ?? true) && !isGuestMode();

  const query = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadNotificationsCount,
    enabled,
    staleTime: 30_000,
  });

  return { count: query.data ?? 0, isLoading: query.isLoading };
}
