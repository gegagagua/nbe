import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { searchFacts } from "@/api/facts";
import i18n from "@/i18n/i18n";
import { showErrorToast } from "@/lib/show-error-toast";
import type { FactsPage, FactsSearchFilters } from "@/types/facts";

const EMPTY_PAGE: FactsPage = { data: [], totalPages: 0, totalRecords: 0 };

/**
 * Fetches a page of the "Statement of Facts" list from
 * `POST /fact-portal/v1/apps/search`. Shaped like {@link useCaseApps}.
 */
export function useFactsApps(
  pageNumber: number,
  filters: FactsSearchFilters = {},
): { data: FactsPage; isLoading: boolean } {
  const query = useQuery({
    queryKey: ["facts-apps", filters, pageNumber],
    queryFn: () => searchFacts(filters, pageNumber),
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t("facts.loadError"), query.error);
    }
  }, [query.error]);

  return { data: query.data ?? EMPTY_PAGE, isLoading: query.isLoading };
}
