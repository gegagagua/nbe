import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { PaymentWebViewModal } from "@/components/ui/payment-web-view-modal";
import { useGuestFinePayment } from "@/hooks/use-guest-fine-payment";
import { showErrorToast } from "@/lib/show-error-toast";
import type { CaseDetailData } from "@/types/case-detail-data";

import { CasePayAmountField } from "./case-pay-amount-field";

/** Pull a numeric GEL amount out of a display string like "3000 GEL".
 * Keeps a leading minus so negative balances (e.g. "-1 ₾") stay negative. */
function parseGelAmount(display?: string | null): number {
  if (!display) return NaN;
  return Number.parseFloat(display.replace(/[^\d.-]/g, ""));
}

type Props = {
  caseId: string;
  personId?: string;
  /** Precise amount carried over from the list item, if any. */
  amount?: string;
  /** Display amount shown on the detail screen, e.g. "3000 GEL". */
  payDisplay?: string;
  data: CaseDetailData;
};

export function CaseDetailPaySection({
  caseId,
  personId,
  amount,
  payDisplay,
  data,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  // After the payment intent sync-status finishes, return to the case screen
  // and reload the list so the paid debt reflects its new state.
  const handlePaymentSynced = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["case-apps"] });
    router.replace("/cases");
  }, [queryClient, router]);

  const { paymentUrl, closePayment, startPayment, isPaying } =
    useGuestFinePayment({ onSynced: handlePaymentSynced });

  // The full amount shown on the detail screen, e.g. "3000 GEL".
  const payLabelAmount = payDisplay || data.claimRows[0]?.amount || "";
  // Currency unit kept alongside the editable numeric amount (e.g. "GEL").
  // Strip the sign too so a negative amount doesn't leak "-" into the suffix.
  const currencySuffix = payLabelAmount.replace(/[\d.,\s+-]/g, "").trim();
  // Maximum payable amount: the precise param value if present, else the
  // numeric part of the displayed amount.
  const paramAmount = amount ? Number.parseFloat(amount) : NaN;
  const maxPayAmount = Number.isFinite(paramAmount)
    ? paramAmount
    : parseGelAmount(payLabelAmount);

  // A zero or negative amount means there is nothing to collect (e.g. a fully
  // paid, overpaid or reversed debt): block payment and surface the actual
  // value instead of clamping it up to the 1-GEL minimum.
  const isNonPayable = Number.isFinite(maxPayAmount) && maxPayAmount <= 0;

  // Build the BOG payment context from the amount the user chose, preferring
  // the data carried over by the list item and falling back to the detail data.
  const handlePay = (payValue: number) => {
    const appId = Number.parseInt(caseId, 10);
    const paramPerson = personId ? Number.parseInt(personId, 10) : NaN;
    const dataPerson = Number.parseInt(
      data.debtors[0]?.paymentIdentifier ?? "",
      10,
    );
    const person = Number.isFinite(paramPerson) ? paramPerson : dataPerson;

    if (!Number.isFinite(appId) || !Number.isFinite(person)) {
      showErrorToast(t("cases.detailPaySoonToast"));
      return;
    }
    startPayment({ destType: "EPS", appId, personId: person, amount: payValue });
  };

  return (
    <>
      <CasePayAmountField
        maxAmount={maxPayAmount}
        currencySuffix={currencySuffix}
        isPaying={isPaying}
        isNonPayable={isNonPayable}
        onPay={handlePay}
      />
      <PaymentWebViewModal
        visible={paymentUrl != null}
        url={paymentUrl}
        onClose={closePayment}
      />
    </>
  );
}
