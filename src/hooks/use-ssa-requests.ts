import { useQuery } from "@tanstack/react-query";

import { getSsaRequests } from "@/api/ssa";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { mapSsaRequests } from "@/lib/map-case-detail";
import type { EpsSsaRequestsEnvelope } from "@/types/case-detail-api";

/**
 * SSA requests (სოციალური მომსახურების სააგენტო) for a case — used by the
 * სოც. სააგენტო block of the მოძიება sub-tab.
 */
export function useSsaRequests(appId: string, options?: { enabled?: boolean }) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId.trim().length > 0;

  return useQuery({
    queryKey: ["ssa-requests", userId, appId],
    enabled: canQuery,
    queryFn: async () => {
      const res = await getSsaRequests(appId);
      return mapSsaRequests(res as EpsSsaRequestsEnvelope);
    },
  });
}
