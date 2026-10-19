import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { DebtorExtractSubheader } from "@/components/debtor-registry/debtor-extract-subheader";
import { debtorExtractRequestStyles as s } from "@/components/debtor-registry/debtor-extract-request.styles";
import { LoginFooter } from "@/components/login/login-footer";
import { AppSafeArea } from "@/components/ui/app-safe-area";
import {
  FactStatementFee,
  defaultFactStatementPaymentMethod,
} from "@/constants/fact-statement";
import { getSessionUserProfile } from "@/lib/session-user-profile-storage";
import type {
  FactStatementForm as FactStatementFormState,
  FactStatementPaymentMethod,
  FactStatementPhase,
} from "@/types/fact-statement";
import { emptyFactStatementForm } from "@/types/fact-statement";

import { FactStatementForm } from "./fact-statement-form";
import { FactStatementPayment } from "./fact-statement-payment";
import { FactStatementSubmit } from "./fact-statement-submit";

/** All required fields must be filled (owner fields only when a kind is picked). */
function findMissing(form: FactStatementFormState): boolean {
  const base = [
    form.organization,
    form.applicantFirstName,
    form.applicantLastName,
    form.applicantPersonalId,
    form.applicantAddress,
    form.applicantPhone,
    form.factDate,
    form.factHourFrom,
    form.factHourTo,
    form.propertyType,
    form.placeAddress,
    form.request,
  ];
  if (form.ownerKind === "physical") {
    base.push(
      form.ownerPersonalId,
      form.ownerFirstName,
      form.ownerLastName,
      form.ownerAddress,
    );
  } else if (form.ownerKind === "legal") {
    base.push(form.ownerLegalCode, form.ownerLegalName, form.ownerAddress);
  }
  return base.some((v) => !v.trim());
}

export function FactStatementScreen() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FactStatementFormState>(() =>
    emptyFactStatementForm(),
  );
  const [phase, setPhase] = useState<FactStatementPhase>("form");
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<FactStatementPaymentMethod>(() =>
    defaultFactStatementPaymentMethod(),
  );
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  // Auto-fill the applicant segment from the signed-in profile.
  useEffect(() => {
    let active = true;
    getSessionUserProfile().then((profile) => {
      if (!active || !profile) return;
      setForm((prev) => ({
        ...prev,
        applicantFirstName: prev.applicantFirstName || profile.firstName || "",
        applicantLastName: prev.applicantLastName || profile.lastName || "",
        applicantPersonalId:
          prev.applicantPersonalId || profile.username || "",
      }));
    });
    return () => {
      active = false;
    };
  }, []);

  const setField = <K extends keyof FactStatementFormState>(
    key: K,
    value: FactStatementFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const onRecord = () => {
    if (findMissing(form)) {
      setError(t("facts.stValidationError"));
      return;
    }
    setError(null);
    setPhase("payment");
  };

  const onPay = () => {
    // TODO: wire the real fact-portal statement create + payment endpoints.
    // Until then a client-side reference number is generated (mirrors the
    // debtor-extract request flow).
    const now = new Date();
    setReferenceNumber(`F${now.getFullYear()}${String(now.getTime()).slice(-6)}`);
    setPhase("submit");
  };

  const handleBack = () => {
    if (phase === "payment") {
      setPhase("form");
      return;
    }
    router.back();
  };

  return (
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <DebtorExtractSubheader
          title={t("facts.makeStatementButton")}
          backA11y={t("facts.backA11yLabel")}
          onBack={handleBack}
        />
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          {phase === "form" ? (
            <FactStatementForm
              form={form}
              onChange={setField}
              error={error}
              onContinue={onRecord}
            />
          ) : null}
          {phase === "payment" ? (
            <FactStatementPayment
              selected={method}
              onSelect={setMethod}
              onPay={onPay}
              amount={FactStatementFee[form.fee]}
            />
          ) : null}
          {phase === "submit" && referenceNumber ? (
            <FactStatementSubmit
              referenceNumber={referenceNumber}
              paymentMethod={method}
              onSent={() => router.back()}
            />
          ) : null}
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
