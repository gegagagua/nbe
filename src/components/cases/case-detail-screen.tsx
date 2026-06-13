import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { getCaseDetailLayoutMock } from "@/constants/case-detail-layout-mock";
import type { CaseDetailMainTab } from "@/types/case-detail-ui";

import { AppSafeArea } from "@/components/ui/app-safe-area";
import { PaymentWebViewModal } from "@/components/ui/payment-web-view-modal";
import { useGuestFinePayment } from "@/hooks/use-guest-fine-payment";
import { showErrorToast } from "@/lib/show-error-toast";

import { CaseDetailApplicationTab } from "./case-detail-application-tab";
import { CaseDetailCloseRow } from "./case-detail-close-row";
import { CaseDetailContactBody } from "./case-detail-contact-body";
import { CaseDetailHeaderSummary } from "./case-detail-header-summary";
import { CaseDetailInfoTab } from "./case-detail-info-tab";
import { CaseDetailMainTabs } from "./case-detail-main-tabs";
import { caseDetailScreenStyles as layout } from "./case-detail-screen.styles";

/** Pull a numeric GEL amount out of a display string like "3000 GEL". */
function parseGelAmount(display?: string | null): number {
  if (!display) return NaN;
  return Number.parseFloat(display.replace(/[^\d.]/g, ""));
}

export function CaseDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id, personId, amount, payDisplay } = useLocalSearchParams<{
    id: string;
    personId?: string;
    amount?: string;
    payDisplay?: string;
  }>();
  const caseId = Array.isArray(id) ? id[0] : (id ?? "");
  const data = useMemo(() => getCaseDetailLayoutMock(caseId), [caseId]);
  const [tab, setTab] = useState<CaseDetailMainTab>("application");

  const { paymentUrl, closePayment, startPayment, isPaying } =
    useGuestFinePayment();

  // The full amount shown on the detail screen, e.g. "3000 GEL".
  const payLabelAmount = payDisplay || data.claimRows[0]?.amount || "";
  // Currency unit kept alongside the editable numeric amount (e.g. "GEL").
  const currencySuffix = payLabelAmount.replace(/[\d.,\s]/g, "").trim();
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
    let value = n < 1 ? 1 : n;
    if (Number.isFinite(maxPayAmount) && value > maxPayAmount) {
      value = maxPayAmount;
    }
    return value;
  }, [amountInput, maxPayAmount]);

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

  // Reflect the editable amount in the pay button label.
  const payButtonLabel = Number.isFinite(payValue)
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
    <AppSafeArea style={layout.page}>
      <ScrollView contentContainerStyle={layout.scroll}>
        <View style={layout.headerRow}>
          <Pressable
            style={layout.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t("cases.detailBack")}
          >
            <Text style={layout.backText}>{t("cases.detailBack")}</Text>
          </Pressable>
          <Text style={layout.title} numberOfLines={1}>
            {t("cases.detailTitle")}
          </Text>
        </View>
        <CaseDetailHeaderSummary data={data} />
        <CaseDetailMainTabs value={tab} onChange={setTab} />
        {tab === "application" ? (
          <CaseDetailApplicationTab data={data} />
        ) : null}
        {tab === "caseInfo" ? <CaseDetailInfoTab data={data} /> : null}
        {tab === "contact" ? (
          <CaseDetailContactBody contact={data.contact} />
        ) : null}
        {Number.isFinite(maxPayAmount) ? (
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
              inputMode="numeric"
              editable={!isPaying}
              placeholder={String(maxPayAmount)}
              accessibilityLabel={t("cases.detailPayAmountLabel")}
            />
          </View>
        ) : null}
        <Pressable
          style={[layout.payButton, isPaying && layout.payButtonDisabled]}
          onPress={handlePay}
          disabled={isPaying}
          accessibilityRole="button"
          accessibilityLabel={t("cases.detailPayButton")}
        >
          <Text style={layout.payButtonText}>{payButtonLabel}</Text>
        </Pressable>
        <CaseDetailCloseRow onClose={() => router.back()} />
      </ScrollView>
      <PaymentWebViewModal
        visible={paymentUrl != null}
        url={paymentUrl}
        onClose={closePayment}
      />
    </AppSafeArea>
  );
}
