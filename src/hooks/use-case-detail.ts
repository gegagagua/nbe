import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  getAppById,
  getAppDemands,
  getAppPersons,
  getAppStatuses,
} from "@/api/case-details";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import i18n from "@/i18n/i18n";
import { mapCaseDetail } from "@/lib/map-case-detail";
import { showErrorToast } from "@/lib/show-error-toast";
import type {
  EpsAppDetailEnvelope,
  EpsDemandsEnvelope,
  EpsPersonsEnvelope,
  EpsStatusesEnvelope,
} from "@/types/case-detail-api";

export function useCaseDetail(appId: string, options?: { enabled?: boolean }) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId.trim().length > 0;

  const query = useQuery({
    queryKey: ["case-detail", userId, appId],
    enabled: canQuery,
    queryFn: async () => {
      const [app, persons, demands, statuses] = await Promise.all([
        getAppById(appId, userId!),
        getAppPersons(appId, userId!),
        getAppDemands(appId, userId!),
        getAppStatuses(appId, userId!),
      ]);
      return mapCaseDetail(
        app as EpsAppDetailEnvelope,
        persons as EpsPersonsEnvelope,
        demands as EpsDemandsEnvelope,
        statuses as EpsStatusesEnvelope,
      );
    },
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t("cases.listError"), query.error);
    }
  }, [query.error]);

  return query;
}
