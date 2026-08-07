import { useQuery } from "@tanstack/react-query";

import { getCasePayments, getCaseTransfers } from "@/api/case-funds-extra";
import { mapCasePayments, mapCaseTransfers } from "@/lib/map-case-detail";
import type {
  CaseDetailPaymentRow,
  CaseDetailTransferRow,
} from "@/types/case-detail-data";

export type CaseFundsExtra = {
  payments: CaseDetailPaymentRow[];
  transfers: CaseDetailTransferRow[];
};

/**
 * Credited payments (ჩარიცხული თანხები) and transfers (გადარიცხვები) for a case,
 * shown below the funds sub-tab. Payments are fetched for both parties
 * (creditor + debtor) and merged, deduped by payment id. Bearer-authenticated
 * through the gateway. Lazy — enable when the funds sub-tab opens.
 */
export function useCaseFundsExtra(appId: string, options?: { enabled?: boolean }) {
  const canQuery = (options?.enabled ?? true) && appId.trim().length > 0;

  return useQuery<CaseFundsExtra>({
    queryKey: ["case-funds-extra", appId],
    enabled: canQuery,
    queryFn: async () => {
      const [creditorPayments, debtorPayments, transfers] = await Promise.all([
        getCasePayments(appId, 1),
        getCasePayments(appId, 2),
        getCaseTransfers(appId),
      ]);

      const byId = new Map<number, CaseDetailPaymentRow>();
      for (const row of [
        ...mapCasePayments(creditorPayments),
        ...mapCasePayments(debtorPayments),
      ]) {
        byId.set(row.id, row);
      }

      return {
        payments: [...byId.values()],
        transfers: mapCaseTransfers(transfers),
      };
    },
  });
}
