import { useQuery } from "@tanstack/react-query";

import { getLandregInfos, getLandregRealEstates } from "@/api/napr";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { mapLandregInfos, mapLandregRealEstates } from "@/lib/map-case-detail";
import type {
  EpsLandregInfosEnvelope,
  EpsLandregRealEstatesEnvelope,
} from "@/types/case-detail-api";
import type { CaseDetailRegistrySearch } from "@/types/case-detail-data";

/**
 * Public registry (საჯარო რეესტრი) for a case — the my.gov.ge info requests and
 * the real estate found, fetched in parallel. Used by the მოძიება sub-tab.
 */
export function useRegistrySearch(
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

  return useQuery<CaseDetailRegistrySearch>({
    queryKey: ["registry-search", userId, appId],
    enabled: canQuery,
    queryFn: async () => {
      const [infosRes, estatesRes] = await Promise.all([
        getLandregInfos(appId),
        getLandregRealEstates(appId),
      ]);
      return {
        infos: mapLandregInfos(infosRes as EpsLandregInfosEnvelope),
        estates: mapLandregRealEstates(
          estatesRes as EpsLandregRealEstatesEnvelope,
        ),
      };
    },
  });
}
