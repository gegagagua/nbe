import { useQuery } from "@tanstack/react-query";

import { getEnregActiveShares, getEnregInfos } from "@/api/napr";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { mapEnregActiveShares, mapEnregInfos } from "@/lib/map-case-detail";
import type {
  EpsEnregActiveSharesEnvelope,
  EpsEnregInfosEnvelope,
} from "@/types/case-detail-api";
import type { CaseDetailBusinessRegistry } from "@/types/case-detail-data";

/**
 * Enterprise registry (სამეწარმეო რეესტრი) for a case — the notifications
 * (enreg/infos) and active shares (enreg/active-shares), fetched in parallel.
 * Used by the სამეწარმეო რეესტრი block of the მოძიება sub-tab.
 */
export function useBusinessRegistry(
  appId: string,
  options?: { enabled?: boolean },
) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId.trim().length > 0;

  return useQuery<CaseDetailBusinessRegistry>({
    queryKey: ["business-registry", userId, appId],
    enabled: canQuery,
    queryFn: async () => {
      const [infosRes, sharesRes] = await Promise.all([
        getEnregInfos(appId),
        getEnregActiveShares(appId),
      ]);
      return {
        notify: mapEnregInfos(infosRes as EpsEnregInfosEnvelope),
        shares: mapEnregActiveShares(sharesRes as EpsEnregActiveSharesEnvelope),
      };
    },
  });
}
