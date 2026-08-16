import { useQuery } from "@tanstack/react-query";

import { getCasePayments, getCaseTransfers } from "@/api/case-funds-extra";
import { mapCasePayments, mapCaseTransfers } from "@/lib/map-case-detail";
import type {
  CaseDetailPaymentRow,
  CaseDetailTransferRow,
} from "@/types/case-detail-data";

export type CaseFundsExtra = {
  creditorPayments: CaseDetailPaymentRow[];
  debtorPayments: CaseDetailPaymentRow[];
  transfers: CaseDetailTransferRow[];
};

/**
 * Credited payments (ჩარიცხული თანხები) and transfers (გადარიცხვები) for a case,
 * shown below the funds sub-tab. Payments are fetched separately for each party
 * (creditor + debtor) and kept apart so the UI can show them under distinct
 * "კრედიტორი" / "მოვალე" headers. Bearer-authenticated through the gateway.
 * Lazy — enable when the funds sub-tab opens.
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

      return {
        creditorPayments: mapCasePayments(creditorPayments),
        debtorPayments: mapCasePayments(debtorPayments),
        transfers: mapCaseTransfers(transfers),
      };
    },
  });
}
