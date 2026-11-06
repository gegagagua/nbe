import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View } from "react-native";

import {
  createFactApp,
  getFactById,
  getFactPersons,
  updateFactApp,
} from "@/api/facts";
import { getUserMe } from "@/api/users";
import { AppHeader } from "@/components/ui";
import { PaymentWebViewModal } from "@/components/ui/payment-web-view-modal";
import {
  FactStatementFee,
  defaultFactStatementPaymentMethod,
} from "@/constants/fact-statement";
import { useGuestFinePayment } from "@/hooks/use-guest-fine-payment";
import { getActiveLegalEntity } from "@/lib/active-legal-entity-storage";
import {
  formatCaseDate,
  hasMissingRequired,
  mergeApplicantLegalEntity,
  mergeApplicantProfile,
} from "@/lib/fact-statement-helpers";
import {
  buildFactAppPayload,
  factAppToFormPatch,
} from "@/lib/fact-statement-payload";
import { mapFactDetail } from "@/lib/map-fact-detail";
import { resolveUserEmail, resolveUserPhone } from "@/lib/resolve-user-contacts";
import { getSessionUserProfile } from "@/lib/session-user-profile-storage";
import { showErrorToast } from "@/lib/show-error-toast";
import { useAppTheme } from "@/theme";
import type {
  FactStatementForm as FactStatementFormState,
  FactStatementPaymentMethod,
  FactStatementPhase,
} from "@/types/fact-statement";
import { emptyFactStatementForm } from "@/types/fact-statement";
import { FactPersonType } from "@/types/facts";

import { FactStatementForm } from "./fact-statement-form";
import { FactStatementPayment } from "./fact-statement-payment";
import { FactStatementRecorded } from "./fact-statement-recorded";
import { FactStatementSubmit } from "./fact-statement-submit";

/** Payments against a fact statement go to the fact-api destination. */
const FACT_PAYMENT_DEST_TYPE = "FACT";

export function FactStatementScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();
  // რედაქტირება from an opened case passes the recorded statement's id — the
  // form is pre-filled from the backend and ჩაწერა becomes an update (PUT).
  const { appId: appIdParam } = useLocalSearchParams<{ appId?: string }>();
  const editAppId = appIdParam != null ? Number(appIdParam) : null;

  const [form, setForm] = useState<FactStatementFormState>(() =>
    emptyFactStatementForm(),
  );
  const [phase, setPhase] = useState<FactStatementPhase>("form");
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<FactStatementPaymentMethod>(() =>
    defaultFactStatementPaymentMethod(),
  );
  // Backend identifiers. ჩაწერა creates the statement server-side: the
  // preliminary case number is the created app id and the payment identifier
  // is the applicant's payCode (F…) — nothing is minted client-side.
  const [appId, setAppId] = useState<number | null>(
    Number.isFinite(editAppId) ? editAppId : null,
  );
  const [applicantPersonId, setApplicantPersonId] = useState<number | null>(
    null,
  );
  const [payIdentifier, setPayIdentifier] = useState<string | null>(null);
  const [preliminaryNumber, setPreliminaryNumber] = useState<string | null>(
    null,
  );
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  // Dates shown next to the case numbers (Confluence parity).
  const [recordedDate, setRecordedDate] = useState<string | null>(null);
  const [registeredDate, setRegisteredDate] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPrefilling, setIsPrefilling] = useState(appId != null);

  // Edit mode — load the recorded statement back into the form.
  useEffect(() => {
    if (appId == null || !isPrefilling) return;
    let active = true;
    Promise.all([getFactById(appId), getFactPersons(appId)])
      .then(([detail, persons]) => {
        if (!active) return;
        const patch = factAppToFormPatch(detail.data, persons);
        setForm((prev) => {
          const next = { ...prev };
          for (const [key, value] of Object.entries(patch)) {
            if (value) {
              (next as Record<string, unknown>)[key] = value;
            }
          }
          return next;
        });
        applyRecordedIdentifiers(appId, persons);
      })
      .catch((err) => {
        if (active) showErrorToast(t("facts.detailLoadError"), err);
      })
      .finally(() => {
        if (active) setIsPrefilling(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fill the applicant segment. When the user has switched to a legal
  // entity, the applicant IS that entity: the form shows the company field set
  // (დასახელება + საიდენტიფიკაციო კოდი) pre-filled from the stored entity.
  // Otherwise it's the signed-in physical person — the stored session brief
  // carries name + username, and the full record (`/users/me`) supplies the
  // personal number and the actual / legal addresses. Skipped in edit mode:
  // there the applicant comes from the saved statement.
  useEffect(() => {
    if (editAppId != null) return;
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
  }, [editAppId]);

  const setField = <K extends keyof FactStatementFormState>(
    key: K,
    value: FactStatementFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  /** Pull the backend identifiers off the statement's persons. */
  function applyRecordedIdentifiers(
    recordedAppId: number,
    persons: Awaited<ReturnType<typeof getFactPersons>>,
  ) {
    const applicant =
      persons.find(
        (p) => p.appPersonType?.id === FactPersonType.applicant,
      ) ?? persons[0];
    setApplicantPersonId(applicant?.id ?? null);
    setPayIdentifier(applicant?.payCode?.trim() || null);
    setPreliminaryNumber(String(recordedAppId));
  }

  const onRecord = async () => {
    if (hasMissingRequired(form)) {
      setError(t("facts.stValidationError"));
      return;
    }
    setError(null);
    setIsRecording(true);
    try {
      // ჩაწერა — record the statement on the backend (create, or update when
      // re-recording after an Edit). The backend issues the identifiers shown
      // on the review step; the list is refreshed so the case appears there.
      const payload = buildFactAppPayload(form);
      let recordedAppId = appId;
      if (recordedAppId == null) {
        recordedAppId = await createFactApp(payload);
        setAppId(recordedAppId);
      } else {
        await updateFactApp(recordedAppId, payload);
      }
      const persons = await getFactPersons(recordedAppId);
      applyRecordedIdentifiers(recordedAppId, persons);
      if (!recordedDate) setRecordedDate(formatCaseDate(new Date()));
      queryClient.invalidateQueries({ queryKey: ["facts-apps"] });
      queryClient.invalidateQueries({ queryKey: ["fact-app", recordedAppId] });
      queryClient.invalidateQueries({
        queryKey: ["fact-persons", recordedAppId],
      });
      setPhase("recorded");
    } catch (err) {
      showErrorToast(t("facts.stCreateError"), err);
    } finally {
      setIsRecording(false);
    }
  };

  const handlePaymentSynced = async () => {
    queryClient.invalidateQueries({ queryKey: ["facts-apps"] });
    if (appId == null) return;
    queryClient.invalidateQueries({ queryKey: ["fact-app", appId] });
    try {
      // Registration happens on the backend once the payment settles — the
      // final case number (F…) comes from the refreshed statement.
      const detail = mapFactDetail(await getFactById(appId));
      if (detail.regnumber) {
        setReferenceNumber(detail.regnumber);
        setRegisteredDate(detail.date || formatCaseDate(new Date()));
        setPhase("submit");
        return;
      }
    } catch {
      // Fall through to the pending notice.
    }
    showErrorToast(t("facts.stPayPendingInfo"));
  };

  const payment = useGuestFinePayment({
    onSynced: () => {
      handlePaymentSynced();
    },
  });

  const onPay = () => {
    if (appId == null || applicantPersonId == null) return;
    payment.startPayment({
      destType: FACT_PAYMENT_DEST_TYPE,
      appId,
      personId: applicantPersonId,
      amount: FactStatementFee[form.fee],
    });
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
        {isPrefilling ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}
        {!isPrefilling && phase === "form" ? (
            <FactStatementForm
              form={form}
              onChange={setField}
              error={error}
              onContinue={() => {
                onRecord();
              }}
              submitting={isRecording}
              /* Applicant fields are auto-filled and never editable — not
                 before recording and not after (spec). */
              lockApplicant={true}
            />
          ) : null}
          {phase === "recorded" && preliminaryNumber ? (
            <FactStatementRecorded
              form={form}
              payIdentifier={payIdentifier ?? ""}
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
              paying={payment.isPaying}
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
      <PaymentWebViewModal
        visible={payment.paymentUrl != null}
        url={payment.paymentUrl}
        onClose={payment.closePayment}
      />
    </View>
  );
}
