import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { searchNotifications } from "@/api/notifications";
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

/** Fetches a page of the notifications feed. Shaped like {@link useFactsApps}. */
export function useNotifications(
  pageNumber: number,
  filters: NotificationsSearchFilters = {},
): { data: NotificationsPage; isLoading: boolean } {
  const query = useQuery({
    queryKey: ["notifications", filters, pageNumber],
    queryFn: () => searchNotifications(filters, pageNumber),
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t("notifications.loadError"), query.error);
    }
  }, [query.error]);

  return { data: query.data ?? EMPTY_PAGE, isLoading: query.isLoading };
}
