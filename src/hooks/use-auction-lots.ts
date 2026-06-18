import { useQuery } from "@tanstack/react-query";

import { getLotsByAppId } from "@/api/auctions";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { mapAuctionLots } from "@/lib/map-case-detail";
import type { EpsLotsEnvelope } from "@/types/case-detail-api";

/** Auction lots for a case (აუქციონი sub-tab). Lazy — enable when opened. */
export function useAuctionLots(appId: string, options?: { enabled?: boolean }) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId.trim().length > 0;

  return useQuery({
    queryKey: ["auction-lots", userId, appId],
    enabled: canQuery,
    queryFn: async () => {
      const res = await getLotsByAppId(appId, userId!);
      return mapAuctionLots(res as EpsLotsEnvelope);
    },
  });
}
