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
 * `POST status/get-files` keyed by `appStatusId`. Both need the `X-User-ID`
 * header, so `userId` must be supplied for the query to run.
 */
export function useFactProtocol(appId: number | null, userId: number | null) {
  const query = useQuery<FactProtocolStatus[]>({
    queryKey: ["fact-protocol", appId, userId],
    enabled: appId != null && userId != null,
    queryFn: async () => {
      const uid = userId as number;
      const statuses = (await getFactStatus(appId as number, uid)).data ?? [];
      return Promise.all(
        statuses.map(async (entry) => {
          // Isolate per-status file failures so one bad/empty status can't blank
          // the whole tab — the status heading still renders.
          let files: FactProtocolStatus["files"] = [];
          try {
            files = mapFactStatusFiles(
              await getFactStatusFiles(entry.id, entry.appId ?? appId, uid),
            );
          } catch {
            files = [];
          }
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
