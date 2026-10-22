import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getFactStatus, getFactStatusFiles } from "@/api/facts";
import i18n from "@/i18n/i18n";
import {
  mapFactProtocolStatus,
  mapFactStatusFiles,
} from "@/lib/map-fact-protocol";
import { showErrorToast } from "@/lib/show-error-toast";
import type { FactProtocolStatus } from "@/types/facts";

/**
 * ოქმი tab data: the statement's proceeding status(es) (usually a single
 * "105 — ფაქტების კონსტატაცია" entry) together with each status's downloadable
 * files. Statuses come from `GET app/{id}/status`; files from
 * `POST status/get-files` keyed by `appStatusId`.
 */
export function useFactProtocol(appId: number | null) {
  const query = useQuery<FactProtocolStatus[]>({
    queryKey: ["fact-protocol", appId],
    enabled: appId != null,
    queryFn: async () => {
      const statuses = (await getFactStatus(appId as number)).data ?? [];
      return Promise.all(
        statuses.map(async (entry) => {
          const files = mapFactStatusFiles(
            await getFactStatusFiles(entry.id, entry.appId ?? appId),
          );
          return mapFactProtocolStatus(entry, files);
        }),
      );
    },
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t("facts.detailLoadError"), query.error);
    }
  }, [query.error]);

  return query;
}
