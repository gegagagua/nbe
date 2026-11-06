import { useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Button, Card } from "@/components/ui";
import type { FactStatementForm } from "@/types/fact-statement";

type Props = {
  form: FactStatementForm;
  /** გადახდის იდენტიფიკატორი — payment identifier, shown as the last applicant field. */
  payIdentifier: string;
  /** საქმის წინასწარი ნომერი — preliminary case number, shown in the top card. */
  preliminaryNumber: string;
  /** Date the statement was recorded, shown next to the number (Confluence parity). */
  preliminaryDate?: string | null;
  onEdit: () => void;
  onPay: () => void;
  onClose: () => void;
};

/** One "label / value" line; skipped entirely when the value is empty. */
function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <View className="gap-0.5">
      <Text className="text-label text-fg-muted">{label}</Text>
      <Text className="text-body font-semibold text-fg">{value}</Text>
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
    <Card className="gap-2">
      <Text className="text-subtitle font-bold text-fg">{title}</Text>
      {children}
    </Card>
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
  preliminaryNumber,
  preliminaryDate,
  onEdit,
  onPay,
  onClose,
}: Props) {
  const { t } = useTranslation();

  const isLegalApplicant = form.applicantKind === "legal";
  const applicantName = isLegalApplicant
    ? form.applicantOrgName
    : [form.applicantFirstName, form.applicantLastName]
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
      {/* საქმის წინასწარი ნომერი — preliminary case number of the recorded statement. */}
      <Card className="items-center gap-0.5 bg-surface-sunken">
        <Text className="text-label text-fg-muted">
          {t("facts.stPreliminaryNumberLabel")}
        </Text>
        <Text className="text-title font-bold text-fg">{preliminaryNumber}</Text>
        {preliminaryDate ? (
          <Text className="text-label text-fg-secondary">{preliminaryDate}</Text>
        ) : null}
      </Card>

      <ReviewSection title={t("facts.stOrganizationLabel")}>
        <ReviewRow
          label={t("facts.stOrganizationLabel")}
          value={form.organization}
        />
      </ReviewSection>

      <ReviewSection title={t("facts.stApplicantSection")}>
        <ReviewRow
          label={
            isLegalApplicant
              ? t("facts.stOrgNameLabel")
              : t("facts.stFirstNameLabel")
          }
          value={applicantName}
        />
        <ReviewRow
          label={
            isLegalApplicant
              ? t("facts.stIdCodeLabel")
              : t("facts.stPersonalIdLabel")
          }
          value={form.applicantPersonalId}
        />
        <ReviewRow
          label={t("facts.stActualAddressLabel")}
          value={form.applicantActualAddress}
        />
        <ReviewRow
          label={t("facts.stLegalAddressLabel")}
          value={form.applicantLegalAddress}
        />
        <ReviewRow label={t("facts.stPhoneLabel")} value={form.applicantPhone} />
        <ReviewRow label={t("facts.stEmailLabel")} value={form.applicantEmail} />
        {/* გადახდის იდენტიფიკატორი — last field in the applicant segment. */}
        <ReviewRow
          label={t("facts.stPayIdentifierLabel")}
          value={payIdentifier}
        />
      </ReviewSection>

      <ReviewSection title={t("facts.stFeeSection")}>
        <ReviewRow label={t("facts.stFeeSection")} value={feeLabel} />
      </ReviewSection>

      <ReviewSection title={t("facts.stFactDateSection")}>
        <ReviewRow label={t("facts.stDateFrom")} value={form.factDateFrom} />
        <ReviewRow label={t("facts.stDateTo")} value={form.factDateTo} />
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

      <Text className="text-caption text-fg-muted">
        {t("facts.stRecordedHint")}
      </Text>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            label={t("facts.stEditButton")}
            variant="secondary"
            onPress={onEdit}
          />
        </View>
        <View className="flex-1">
          <Button label={t("facts.stPayButton")} onPress={onPay} />
        </View>
      </View>
      <Button label={t("facts.stCloseButton")} onPress={onClose} />
    </>
  );
}
