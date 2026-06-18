import { useQuery } from "@tanstack/react-query";

import { getInstallment, getInstallmentPayments } from "@/api/installments";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import {
  mapInstallmentMeta,
  mapInstallmentPayments,
} from "@/lib/map-case-detail";
import type {
  EpsInstallmentPaymentsEnvelope,
  EpsInstallmentsEnvelope,
} from "@/types/case-detail-api";
import type { CaseDetailInstallment } from "@/types/case-detail-data";

/**
 * Installments for a case (განწილვადება sub-tab). Fetches the installment list
 * (passing appId as the `{id}` path param) then the payments for each. Lazy —
 * enable when the sub-tab is opened.
 */
export function useInstallments(appId: string, options?: { enabled?: boolean }) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId.trim().length > 0;

  return useQuery<CaseDetailInstallment[]>({
    queryKey: ["installments", userId, appId],
    enabled: canQuery,
    queryFn: async () => {
      const list = (await getInstallment(
        appId,
        userId!,
      )) as EpsInstallmentsEnvelope;
      const installments = list.data ?? [];
      return Promise.all(
        installments.map(async (inst) => {
          const valuta = inst.valutaName?.trim() ?? "";
          const paymentsRes = (await getInstallmentPayments(
            appId,
            inst.id,
            userId!,
          )) as EpsInstallmentPaymentsEnvelope;
          return {
            ...mapInstallmentMeta(inst),
            payments: mapInstallmentPayments(paymentsRes, valuta),
          };
        }),
      );
    },
  });
}
