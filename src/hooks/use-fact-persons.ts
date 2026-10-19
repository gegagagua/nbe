import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getFactPersons } from "@/api/facts";
import i18n from "@/i18n/i18n";
import { mapFactPersons } from "@/lib/map-fact-persons";
import { showErrorToast } from "@/lib/show-error-toast";

/** Applicants and owners of a fact statement (`GET /fact-portal/v1/persons/app/{id}`). */
export function useFactPersons(appId: number | null) {
  const query = useQuery({
    queryKey: ["fact-persons", appId],
    queryFn: async () => mapFactPersons(await getFactPersons(appId as number)),
    enabled: appId != null,
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t("facts.detailLoadError"), query.error);
    }
  }, [query.error]);

  return {
    applicants: query.data?.applicants ?? [],
    owners: query.data?.owners ?? [],
  };
}
