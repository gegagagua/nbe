import { useQuery } from "@tanstack/react-query";

import {
  type AppPersonType,
  getMiaInfoRests,
  getMiaProperties,
} from "@/api/mia";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { mapMiaInfoRests, mapMiaProperties } from "@/lib/map-case-detail";
import type {
  EpsMiaInfoRestsEnvelope,
  EpsMiaPropertiesEnvelope,
} from "@/types/case-detail-api";

/**
 * MIA property list (შსს ქონების სია) for a case party — appPersonTypeId 1 =
 * creditor (კრედიტორი), 2 = debtor (მოვალე). Used by the მოძიება sub-tab.
 */
export function useMiaProperties(
  appId: string,
  appPersonTypeId: AppPersonType,
  options?: { enabled?: boolean },
) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId.trim().length > 0;

  return useQuery({
    queryKey: ["mia-properties", userId, appId, appPersonTypeId],
    enabled: canQuery,
    queryFn: async () => {
      const res = await getMiaProperties(appId, appPersonTypeId);
      return mapMiaProperties(res as EpsMiaPropertiesEnvelope);
    },
  });
}

/**
 * MIA restrictions list (შსს შეზღუდვები) for a case party — same appPersonTypeId
 * mapping as {@link useMiaProperties} (1 = creditor, 2 = debtor). Backs the
 * "შეზღუდვები" block of the მოძიება sub-tab.
 */
export function useMiaInfoRests(
  appId: string,
  appPersonTypeId: AppPersonType,
  options?: { enabled?: boolean },
) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId.trim().length > 0;

  return useQuery({
    queryKey: ["mia-info-rests", userId, appId, appPersonTypeId],
    enabled: canQuery,
    queryFn: async () => {
      const res = await getMiaInfoRests(appId, appPersonTypeId);
      return mapMiaInfoRests(res as EpsMiaInfoRestsEnvelope);
    },
  });
}
