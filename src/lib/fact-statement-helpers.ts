import type { FactStatementForm } from "@/types/fact-statement";

/**
 * Pure (React-Native-free) helpers for the "ფაქტების კონსტატაცია" make-statement
 * flow. Kept separate from the screen component so the logic can be unit-tested
 * without a RN renderer.
 */

/** DD.MM.YYYY — the date shown next to the case numbers (Confluence parity). */
export function formatCaseDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}.${m}.${date.getFullYear()}`;
}

/**
 * Split a pipe-joined locale string into `{ value, label }` select options.
 * A pipe (not a comma) is the separator because some option labels contain a
 * comma (e.g. "იმერეთის, რაჭა-ლეჩხუმისა და ქვემო სვანეთის სააღსრულებო ბიურო").
 */
export function parseOptionList(
  joined: string,
): { value: string; label: string }[] {
  return joined
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((label) => ({ value: label, label }));
}

/**
 * True when a required field is empty. Owner fields are only required once a
 * concrete owner kind is picked. The legal address is optional; the actual
 * address is required.
 */
export function hasMissingRequired(form: FactStatementForm): boolean {
  const base = [
    form.organization,
    form.applicantFirstName,
    form.applicantLastName,
    form.applicantPersonalId,
    form.applicantActualAddress,
    form.applicantPhone,
    form.factDateFrom,
    form.factDateTo,
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

/** Applicant fields that can be pre-filled from the signed-in profile. */
export type ApplicantProfilePatch = {
  applicantFirstName?: string | null;
  applicantLastName?: string | null;
  applicantPersonalId?: string | null;
  applicantActualAddress?: string | null;
  applicantLegalAddress?: string | null;
};

/**
 * Merge profile data into the applicant segment WITHOUT overwriting values the
 * user already entered (an existing non-empty field wins over the patch).
 */
export function mergeApplicantProfile(
  form: FactStatementForm,
  patch: ApplicantProfilePatch,
): FactStatementForm {
  return {
    ...form,
    applicantFirstName:
      form.applicantFirstName || patch.applicantFirstName || "",
    applicantLastName: form.applicantLastName || patch.applicantLastName || "",
    applicantPersonalId:
      form.applicantPersonalId || patch.applicantPersonalId || "",
    applicantActualAddress:
      form.applicantActualAddress || patch.applicantActualAddress || "",
    applicantLegalAddress:
      form.applicantLegalAddress || patch.applicantLegalAddress || "",
  };
}

/**
 * ჩაწერა mints two distinct identifiers: a 5-digit preliminary case number
 * (საქმის წინასწარი ნომერი) and a longer, separate payment identifier
 * (გადახდის იდენტიფიკატორი).
 */
export function mintStatementIdentifiers(now: Date): {
  preliminaryNumber: string;
  payIdentifier: string;
} {
  const ms = String(now.getTime());
  return { preliminaryNumber: ms.slice(-5), payIdentifier: ms.slice(-11) };
}

/** The registration (case) number minted once payment goes through. */
export function mintRegistrationNumber(now: Date): string {
  return `F${now.getFullYear()}${String(now.getTime()).slice(-6)}`;
}
