import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { fetchNotifications } from "@/api/notifications";
import { NotificationsPageSize } from "@/constants/notifications";
import i18n from "@/i18n/i18n";
import { showErrorToast } from "@/lib/show-error-toast";
import type {
  AppNotification,
  NotificationsPage,
  NotificationsSearchFilters,
} from "@/types/notifications";

const EMPTY_PAGE: NotificationsPage = {
  data: [],
  totalPages: 0,
  totalRecords: 0,
};

/**
 * Fetches the notifications feed and applies the read/unread filter plus
 * pagination client-side. The backend `search` has no read filter, so the whole
 * window is cached under one key and filtered/sliced here.
 */
export function useNotifications(
  pageNumber: number,
  filters: NotificationsSearchFilters = {},
): { data: NotificationsPage; isLoading: boolean; unreadCount: number } {
  const readState = filters.readState ?? "all";

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t("notifications.loadError"), query.error);
    }
  }, [query.error]);

  const page = useMemo<NotificationsPage>(() => {
    const all = query.data;
    if (!all) {
      return EMPTY_PAGE;
    }
    const filtered =
      readState === "all"
        ? all
        : all.filter((item) => item.isRead === (readState === "read"));
    const start = pageNumber * NotificationsPageSize;
    return {
      data: filtered.slice(start, start + NotificationsPageSize),
      totalPages: Math.max(1, Math.ceil(filtered.length / NotificationsPageSize)),
      totalRecords: filtered.length,
    };
  }, [query.data, readState, pageNumber]);

  // Derived from the fetched feed so the badge reflects the notifications the
  // user actually sees. The `count-unread` endpoint is unreliable here — in
  // testing it consistently reported one more than the real unread rows.
  const unreadCount = useMemo(
    () => (query.data ?? []).filter((item) => !item.isRead).length,
    [query.data],
  );

  return { data: page, isLoading: query.isLoading, unreadCount };
}

/**
 * Reads a single notification out of the cached feed by id. Reactive to the
 * shared `["notifications"]` query, so it updates when the row is marked read.
 */
export function useNotificationById(id: number): {
  notification: AppNotification | null;
  isLoading: boolean;
} {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const notification = useMemo(
    () => query.data?.find((item) => item.id === id) ?? null,
    [query.data, id],
  );

  return { notification, isLoading: query.isLoading };
}
