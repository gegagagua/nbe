import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, View } from "react-native";

import { PaymentWebViewModal } from "@/components/ui/payment-web-view-modal";
import { useGuestFinePayment } from "@/hooks/use-guest-fine-payment";
import { showErrorToast } from "@/lib/show-error-toast";
import type { CaseDetailData } from "@/types/case-detail-data";

import { caseDetailScreenStyles as layout } from "./case-detail-screen.styles";

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

  // Editable amount. Defaults to the full (max) amount; the user can lower it
  // down to a minimum of 1.
  const [amountInput, setAmountInput] = useState<string>(
    Number.isFinite(maxPayAmount) ? String(maxPayAmount) : "",
  );

  // Numeric amount actually charged, clamped to [1, maxPayAmount].
  const payValue = useMemo(() => {
    const n = Number.parseFloat(amountInput.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(n)) return NaN;
    const value = n < 1 ? 1 : n;
    return value;
  }, [amountInput]);

  const handleAmountChange = (text: string) => {
    setAmountInput(text.replace(/[^\d.]/g, ""));
  };

  // Normalise the field to the clamped value when focus leaves it.
  const handleAmountBlur = () => {
    if (Number.isFinite(payValue)) {
      setAmountInput(String(payValue));
    } else if (Number.isFinite(maxPayAmount)) {
      setAmountInput(String(maxPayAmount));
    }
  };

  // Build the BOG payment context, preferring the data carried over by the
  // list item and falling back to the data shown on the detail screen. The
  // charged amount comes from the editable input above.
  const paymentContext = useMemo(() => {
    const appId = Number.parseInt(caseId, 10);

    const paramPerson = personId ? Number.parseInt(personId, 10) : NaN;
    const dataPerson = Number.parseInt(
      data.debtors[0]?.paymentIdentifier ?? "",
      10,
    );
    const person = Number.isFinite(paramPerson) ? paramPerson : dataPerson;

    if (
      !Number.isFinite(appId) ||
      !Number.isFinite(person) ||
      !Number.isFinite(payValue)
    ) {
      return null;
    }
    return { destType: "EPS", appId, personId: person, amount: payValue };
  }, [caseId, personId, data, payValue]);

  // A negative amount means there is nothing to collect (e.g. an overpaid or
  // reversed debt): block payment and surface the negative value instead.
  const isNegativeAmount = Number.isFinite(maxPayAmount) && maxPayAmount < 0;

  // Reflect the editable amount in the pay button label.
  const payButtonLabel = isNegativeAmount
    ? `${maxPayAmount}${currencySuffix ? ` ${currencySuffix}` : ""}`
    : payValue
      ? `${t("cases.detailPayButton")} · ${payValue}${
          currencySuffix ? ` ${currencySuffix}` : ""
        }`
      : t("cases.detailPayButton");

  const handlePay = () => {
    if (paymentContext) {
      startPayment(paymentContext);
      return;
    }
    showErrorToast(t("cases.detailPaySoonToast"));
  };

  return (
    <>
      <View style={layout.payAmountWrap}>
        <Text style={layout.payAmountLabel}>
          {t("cases.detailPayAmountLabel")}
        </Text>
        <TextInput
          style={layout.payInput}
          value={amountInput}
          onChangeText={handleAmountChange}
          onBlur={handleAmountBlur}
          keyboardType="numeric"
          editable={!isPaying && !isNegativeAmount}
          placeholder={String(maxPayAmount)}
          accessibilityLabel={t("cases.detailPayAmountLabel")}
        />
      </View>
      <Pressable
        style={[
          layout.payButton,
          (isPaying || isNegativeAmount) && layout.payButtonDisabled,
        ]}
        onPress={handlePay}
        disabled={isPaying || isNegativeAmount}
        accessibilityRole="button"
        accessibilityLabel={t("cases.detailPayButton")}
      >
        <Text style={layout.payButtonText}>{payButtonLabel}</Text>
      </Pressable>
      <PaymentWebViewModal
        visible={paymentUrl != null}
        url={paymentUrl}
        onClose={closePayment}
      />
    </>
  );
}
