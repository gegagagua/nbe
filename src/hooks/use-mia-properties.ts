import { useQuery } from "@tanstack/react-query";

import { type AppPersonType, getMiaProperties } from "@/api/mia";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { mapMiaProperties } from "@/lib/map-case-detail";
import type { EpsMiaPropertiesEnvelope } from "@/types/case-detail-api";

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
