import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { fetchNotifications } from "@/api/notifications";
import { NotificationsPageSize } from "@/constants/notifications";
import i18n from "@/i18n/i18n";
import { showErrorToast } from "@/lib/show-error-toast";
import type {
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
): { data: NotificationsPage; isLoading: boolean } {
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

  return { data: page, isLoading: query.isLoading };
}
