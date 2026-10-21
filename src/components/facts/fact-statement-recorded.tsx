import { useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { debtorAppDetailActionsStyles as actions } from "@/components/debtor-registry/debtor-app-detail-actions.styles";
import { debtorExtractRequestStyles as s } from "@/components/debtor-registry/debtor-extract-request.styles";
import type { FactStatementForm } from "@/types/fact-statement";

import { factStatementStyles as fs } from "./fact-statement.styles";

type Props = {
  form: FactStatementForm;
  /** Preliminary application / payment identifier generated on Record (fig.2). */
  payIdentifier: string;
  onEdit: () => void;
  onPay: () => void;
  onClose: () => void;
};

/** One "label / value" line; skipped entirely when the value is empty. */
function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <View style={fs.reviewRow}>
      <Text style={fs.reviewLabel}>{label}</Text>
      <Text style={fs.reviewValue}>{value}</Text>
    </View>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={s.sectionCard}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

/**
 * ჩაწერილი განცხადება — read-only summary of the entered data shown right after
 * "ჩაწერა" (Record). A payment identifier is generated here (fig.2); from this
 * state the user can Edit (back to the form), Pay (go to the payment page) or
 * Close (leave). Mirrors the detail screen's "recorded case" action row.
 */
export function FactStatementRecorded({
  form,
  payIdentifier,
  onEdit,
  onPay,
  onClose,
}: Props) {
  const { t } = useTranslation();

  const applicantName = [form.applicantFirstName, form.applicantLastName]
    .filter(Boolean)
    .join(" ");
  const feeLabel = useMemo(
    () =>
      form.fee === "working"
        ? t("facts.stFeeWorking")
        : t("facts.stFeeNonworking"),
    [form.fee, t],
  );
  const factTime = [form.factHourFrom, form.factHourTo]
    .filter(Boolean)
    .join(" – ");
  const ownerName =
    form.ownerKind === "physical"
      ? [form.ownerFirstName, form.ownerLastName].filter(Boolean).join(" ")
      : form.ownerLegalName;

  return (
    <>
      {/* გადახდის იდენტიფიკატორი — generated the moment the statement is recorded. */}
      <View style={fs.payIdCard}>
        <Text style={fs.payIdLabel}>{t("facts.stPayIdentifierLabel")}</Text>
        <Text style={fs.payIdValue}>{payIdentifier}</Text>
      </View>

      <ReviewSection title={t("facts.stOrganizationLabel")}>
        <ReviewRow
          label={t("facts.stOrganizationLabel")}
          value={form.organization}
        />
      </ReviewSection>

      <ReviewSection title={t("facts.stApplicantSection")}>
        <ReviewRow label={t("facts.stFirstNameLabel")} value={applicantName} />
        <ReviewRow
          label={t("facts.stPersonalIdLabel")}
          value={form.applicantPersonalId}
        />
        <ReviewRow
          label={t("facts.stApplicantAddressLabel")}
          value={form.applicantAddress}
        />
        <ReviewRow label={t("facts.stPhoneLabel")} value={form.applicantPhone} />
        <ReviewRow label={t("facts.stEmailLabel")} value={form.applicantEmail} />
      </ReviewSection>

      <ReviewSection title={t("facts.stFeeSection")}>
        <ReviewRow label={t("facts.stFeeSection")} value={feeLabel} />
      </ReviewSection>

      <ReviewSection title={t("facts.stFactDateSection")}>
        <ReviewRow label={t("facts.stCalendarLabel")} value={form.factDate} />
        <ReviewRow label={t("facts.stTimeLabel")} value={factTime} />
      </ReviewSection>

      <ReviewSection title={t("facts.stPlaceSection")}>
        <ReviewRow
          label={t("facts.stPropertyTypeLabel")}
          value={form.propertyType}
        />
        <ReviewRow label={t("facts.stCadCodeLabel")} value={form.cadCode} />
        <ReviewRow
          label={t("facts.stPlaceAddressLabel")}
          value={form.placeAddress}
        />
      </ReviewSection>

      {form.ownerKind !== "none" ? (
        <ReviewSection title={t("facts.stOwnerSection")}>
          <ReviewRow
            label={t("facts.stOwnerTypeLabel")}
            value={
              form.ownerKind === "physical"
                ? t("facts.stOwnerTypePhysical")
                : t("facts.stOwnerTypeLegal")
            }
          />
          <ReviewRow label={t("facts.stOwnerLegalNameLabel")} value={ownerName} />
          <ReviewRow
            label={
              form.ownerKind === "physical"
                ? t("facts.stPersonalIdLabel")
                : t("facts.stOwnerLegalCodeLabel")
            }
            value={
              form.ownerKind === "physical"
                ? form.ownerPersonalId
                : form.ownerLegalCode
            }
          />
          <ReviewRow
            label={t("facts.stOwnerAddressLabel")}
            value={form.ownerAddress}
          />
        </ReviewSection>
      ) : null}

      <ReviewSection title={t("facts.stRequestLabel")}>
        <ReviewRow label={t("facts.stRequestLabel")} value={form.request} />
      </ReviewSection>

      <Text style={s.hintText}>{t("facts.stRecordedHint")}</Text>
      <View style={actions.row}>
        <Pressable
          style={[actions.btn, actions.editBtn]}
          onPress={onEdit}
          accessibilityRole="button"
        >
          <Text style={actions.editLabel}>{t("facts.stEditButton")}</Text>
        </Pressable>
        <Pressable
          style={[actions.btn, actions.payBtn]}
          onPress={onPay}
          accessibilityRole="button"
        >
          <Text style={actions.payLabel}>{t("facts.stPayButton")}</Text>
        </Pressable>
      </View>
      <Pressable
        style={actions.fullBtn}
        onPress={onClose}
        accessibilityRole="button"
      >
        <Text style={actions.payLabel}>{t("facts.stCloseButton")}</Text>
      </Pressable>
    </>
  );
}
