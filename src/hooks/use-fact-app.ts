import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getFactById } from "@/api/facts";
import i18n from "@/i18n/i18n";
import { mapFactDetail } from "@/lib/map-fact-detail";
import { showErrorToast } from "@/lib/show-error-toast";

/** Single fact statement from `GET /fact-portal/v1/apps/{id}`. */
export function useFactApp(appId: number | null) {
  const query = useQuery({
    queryKey: ["fact-app", appId],
    queryFn: async () => mapFactDetail(await getFactById(appId as number)),
    enabled: appId != null,
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t("facts.detailLoadError"), query.error);
    }
  }, [query.error]);

  return query;
}
