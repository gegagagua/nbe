import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { AppHeader } from "@/components/ui";
import {
  FactStatementFee,
  defaultFactStatementPaymentMethod,
} from "@/constants/fact-statement";
import { getUserMe } from "@/api/users";
import {
  formatCaseDate,
  hasMissingRequired,
  mergeApplicantLegalEntity,
  mergeApplicantProfile,
  mintRegistrationNumber,
  mintStatementIdentifiers,
} from "@/lib/fact-statement-helpers";
import { getActiveLegalEntity } from "@/lib/active-legal-entity-storage";
import { resolveUserEmail, resolveUserPhone } from "@/lib/resolve-user-contacts";
import { getSessionUserProfile } from "@/lib/session-user-profile-storage";
import type {
  FactStatementForm as FactStatementFormState,
  FactStatementPaymentMethod,
  FactStatementPhase,
} from "@/types/fact-statement";
import { emptyFactStatementForm } from "@/types/fact-statement";

import { FactStatementForm } from "./fact-statement-form";
import { FactStatementPayment } from "./fact-statement-payment";
import { FactStatementRecorded } from "./fact-statement-recorded";
import { FactStatementSubmit } from "./fact-statement-submit";

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
  const [payIdentifier, setPayIdentifier] = useState<string | null>(null);
  const [preliminaryNumber, setPreliminaryNumber] = useState<string | null>(
    null,
  );
  // Dates shown next to the case numbers (Confluence parity).
  const [recordedDate, setRecordedDate] = useState<string | null>(null);
  const [registeredDate, setRegisteredDate] = useState<string | null>(null);

  // Auto-fill the applicant segment. When the user has switched to a legal
  // entity, the applicant IS that entity: the form shows the company field set
  // (დასახელება + საიდენტიფიკაციო კოდი) pre-filled from the stored entity.
  // Otherwise it's the signed-in physical person — the stored session brief
  // carries name + username, and the full record (`/users/me`) supplies the
  // personal number and the actual / legal addresses.
  useEffect(() => {
    let active = true;
    const apply = (next: Parameters<typeof mergeApplicantProfile>[1]) => {
      if (!active) return;
      setForm((prev) => mergeApplicantProfile(prev, next));
    };

    getActiveLegalEntity().then((entity) => {
      if (!active) return;
      if (entity) {
        // Acting as a legal entity — the applicant IS that entity (name + code
        // + addresses + email from the entity). The entity has no phone of its
        // own, so the phone (and email, if the entity lacks one) is pulled from
        // the signed-in physical person's contacts.
        setForm((prev) => mergeApplicantLegalEntity(prev, entity));
        getUserMe()
          .then((user) => {
            apply({
              applicantPhone: resolveUserPhone(user.contacts) || "",
              applicantEmail: resolveUserEmail(user.contacts) || "",
            });
          })
          .catch(() => {
            // Best effort — entity email (if any) stays; phone may need backend.
          });
        return;
      }

      getSessionUserProfile().then((profile) => {
        if (!profile) return;
        apply({
          applicantFirstName: profile.firstName || "",
          applicantLastName: profile.lastName || "",
          applicantPersonalId: profile.username || "",
        });
      });

      getUserMe()
        .then((user) => {
          apply({
            applicantFirstName: user.firstName || "",
            applicantLastName: user.lastName || "",
            applicantPersonalId: user.idnumber || user.username || "",
            applicantActualAddress: user.realAddress || "",
            applicantLegalAddress: user.legalAddress || "",
            // Phone & email live in the contacts[] array, not as top-level
            // fields — resolve them the same way the profile screen does.
            applicantPhone: resolveUserPhone(user.contacts) || "",
            applicantEmail: resolveUserEmail(user.contacts) || "",
          });
        })
        .catch(() => {
          // Keep whatever the session brief provided; no hard failure.
        });
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
    if (hasMissingRequired(form)) {
      setError(t("facts.stValidationError"));
      return;
    }
    setError(null);
    // ჩაწერა — recording the statement generates a preliminary case number
    // (საქმის წინასწარი ნომერი, shown at the top) and a separate payment
    // identifier (გადახდის იდენტიფიკატორი, shown as the last applicant field),
    // then moves to the read-only review step where the user can Edit, Pay, or
    // Close. Keep any identifiers already generated so an Edit → Record
    // round-trip doesn't mint new ones.
    if (!preliminaryNumber || !payIdentifier) {
      const now = new Date();
      const ids = mintStatementIdentifiers(now);
      setPreliminaryNumber(ids.preliminaryNumber);
      setPayIdentifier(ids.payIdentifier);
      setRecordedDate(formatCaseDate(now));
    }
    setPhase("recorded");
  };

  const onPay = () => {
    // TODO: wire the real fact-portal statement create + payment endpoints.
    // Until then a client-side reference number is generated (mirrors the
    // debtor-extract request flow). The registration number (F…) is only minted
    // once payment goes through — the preliminary pay identifier was generated
    // earlier, on Record.
    const now = new Date();
    setReferenceNumber(mintRegistrationNumber(now));
    setRegisteredDate(formatCaseDate(now));
    setPhase("submit");
  };

  const handleBack = () => {
    if (phase === "recorded") {
      setPhase("form");
      return;
    }
    if (phase === "payment") {
      setPhase("recorded");
      return;
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-bg">
      <AppHeader title={t("facts.makeStatementButton")} onBack={handleBack} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {phase === "form" ? (
            <FactStatementForm
              form={form}
              onChange={setField}
              error={error}
              onContinue={onRecord}
              /* Applicant fields are auto-filled and never editable — not
                 before recording and not after (spec). */
              lockApplicant={true}
            />
          ) : null}
          {phase === "recorded" && payIdentifier && preliminaryNumber ? (
            <FactStatementRecorded
              form={form}
              payIdentifier={payIdentifier}
              preliminaryNumber={preliminaryNumber}
              preliminaryDate={recordedDate}
              onEdit={() => {
                // Back to the form — applicant fields stay locked (always).
                setPhase("form");
              }}
              onPay={() => setPhase("payment")}
              onClose={() => router.back()}
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
              registeredDate={registeredDate}
              paymentMethod={method}
              onSent={() => router.back()}
            />
          ) : null}
      </ScrollView>
    </View>
  );
}
