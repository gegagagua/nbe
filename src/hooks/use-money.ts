import { useQuery } from "@tanstack/react-query";

import { getCreditorMoney, getDebtorMoney } from "@/api/money";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { mapMoneyParty } from "@/lib/map-case-detail";
import type { EpsMoneyEnvelope } from "@/types/case-detail-api";
import type { CaseDetailFundsInfo } from "@/types/case-detail-data";

/**
 * Funds info for a case (ინფორმაცია თანხებზე sub-tab). Fetches the creditor and
 * debtor reg-money endpoints in parallel. Lazy — enable when the sub-tab opens.
 */
export function useMoney(appId: string, options?: { enabled?: boolean }) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId.trim().length > 0;

  return useQuery<CaseDetailFundsInfo>({
    queryKey: ["money", userId, appId],
    enabled: canQuery,
    queryFn: async () => {
      const [creditorRes, debtorRes] = await Promise.all([
        getCreditorMoney(appId, userId!),
        getDebtorMoney(appId, userId!),
      ]);
      return {
        creditor: mapMoneyParty(creditorRes as EpsMoneyEnvelope, 1),
        debtor: mapMoneyParty(debtorRes as EpsMoneyEnvelope, 2),
      };
    },
  });
}
