import { useQuery } from "@tanstack/react-query";

import { fetchNotifications } from "@/api/notifications";
import { isGuestMode } from "@/lib/guest-mode";

/**
 * Unread-notifications count for the header bell badge.
 *
 * Derived from the notifications feed (the shared `["notifications"]` query),
 * NOT the `count-unread` endpoint: that endpoint consistently reports one more
 * than the real unread rows, which left the bell stuck showing "1" even after
 * every notification had been marked read. Counting the unread rows off the
 * same feed the notifications page renders keeps the badge and the list in
 * agreement, and marking-as-read (which invalidates `["notifications"]`) clears
 * the badge. Skipped for guests.
 */
export function useUnreadNotificationsCount(options?: { enabled?: boolean }) {
  const enabled = (options?.enabled ?? true) && !isGuestMode();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled,
  });

  const count = (query.data ?? []).filter((item) => !item.isRead).length;
  return { count, isLoading: query.isLoading };
}
