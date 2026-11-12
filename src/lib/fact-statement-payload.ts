import { FactStatementFee } from "@/constants/fact-statement";
import i18n from "@/i18n/i18n";
import { parseOptionList } from "@/lib/fact-statement-helpers";
import { mapFactPersons } from "@/lib/map-fact-persons";
import { kaFacts } from "@/locales/fragments/ka-facts";
import type { FactStatementForm } from "@/types/fact-statement";
import {
  FactPersonType,
  type FactAppDetailResponse,
  type FactAppPayload,
  type FactAppPersonPayload,
  type FactPersonResponse,
} from "@/types/facts";

/** "09:00" → 9; "" → null — `fixedHourFrom/To` are whole hours on the backend. */
function hourNumber(value: string): number | null {
  const match = /^(\d{1,2})/.exec(value.trim());
  return match ? Number(match[1]) : null;
}

/** `9` → "09:00"; null → "" — inverse of {@link hourNumber}. */
function hourText(hour: number | null | undefined): string {
  return hour == null ? "" : `${String(hour).padStart(2, "0")}:00`;
}

/**
 * The form stores the LOCALIZED option label the user picked, but the backend
 * dictionaries are Georgian — translate a label back to its canonical KA name
 * by list position (the option lists are parallel across locales).
 */
function kaOption(picked: string, localizedJoined: string, kaJoined: string): string {
  const localized = parseOptionList(localizedJoined);
  const ka = parseOptionList(kaJoined);
  const index = localized.findIndex((option) => option.label === picked.trim());
  return index >= 0 && ka[index] ? ka[index].label : picked.trim();
}

const text = (value: string | null | undefined) => value?.trim() ?? "";

/** Phone / email are rows in `persons[].contacts[]`, keyed by `type`. */
function contactByType(
  contacts: FactPersonResponse["contacts"],
  types: string[],
): string {
  const match = (contacts ?? []).find((c) =>
    types.includes((c.type ?? "").toUpperCase()),
  );
  return text(match?.contact);
}

/**
 * Build the create/update body for `POST|PUT /fact-portal/v1/apps` from the
 * statement form. The shape is the inverse of the detail GET
 * (`FactAppDetailResponse`) with dictionary refs sent by Georgian name, the
 * same convention the search payload uses.
 *
 * NOTE: the fact-api create schema could not be verified against a live
 * backend (gateway rejects unauthenticated calls; no spec in-repo). If the
 * backend rejects this body, this builder is the only place to adjust — the
 * rest of the record/pay flow is wired to the shared, verified infrastructure.
 */
export function buildFactAppPayload(form: FactStatementForm): FactAppPayload {
  const applicant: FactAppPersonPayload = {
    appPersonType: { id: FactPersonType.applicant },
    ...(form.applicantKind === "legal"
      ? { organization: text(form.applicantOrgName) }
      : {
          firstName: text(form.applicantFirstName),
          lastName: text(form.applicantLastName),
        }),
    idnumber: text(form.applicantPersonalId),
    phone: text(form.applicantPhone) || null,
    email: text(form.applicantEmail) || null,
    addresses: [
      { type: "FACTUAL", address: text(form.applicantActualAddress) },
      ...(text(form.applicantLegalAddress)
        ? [{ type: "LEGAL", address: text(form.applicantLegalAddress) }]
        : []),
    ],
  };

  const persons: FactAppPersonPayload[] = [applicant];
  if (form.ownerKind !== "none") {
    persons.push({
      appPersonType: { id: FactPersonType.owner },
      ...(form.ownerKind === "legal"
        ? { organization: text(form.ownerLegalName) }
        : {
            firstName: text(form.ownerFirstName),
            lastName: text(form.ownerLastName),
          }),
      idnumber: text(
        form.ownerKind === "legal" ? form.ownerLegalCode : form.ownerPersonalId,
      ),
      addresses: [{ type: "FACTUAL", address: text(form.ownerAddress) }],
    });
  }

  return {
    data: {
      agency: {
        name: kaOption(
          form.organization,
          i18n.t("facts.stBureauOptions"),
          kaFacts.stBureauOptions,
        ),
      },
      trService: {
        name:
          form.fee === "working" ? kaFacts.stFeeWorking : kaFacts.stFeeNonworking,
        price: FactStatementFee[form.fee],
      },
      fixedDayFrom: form.factDateFrom,
      fixedDayTo: form.factDateTo,
      fixedHourFrom: hourNumber(form.factHourFrom),
      fixedHourTo: hourNumber(form.factHourTo),
      appNote: {
        request: text(form.request),
        propertyAddress: text(form.placeAddress),
        cadCode: text(form.cadCode) || null,
        propertyType: text(form.propertyType)
          ? {
              name: kaOption(
                form.propertyType,
                i18n.t("facts.stPropertyTypeOptions"),
                kaFacts.stPropertyTypeOptions,
              ),
            }
          : null,
      },
      persons,
    },
  };
}

/**
 * Inverse mapping for რედაქტირება from an opened case: loads a recorded
 * statement (detail GET + persons GET) back into the statement form so it can
 * be edited and re-recorded via PUT.
 */
export function factAppToFormPatch(
  app: FactAppDetailResponse["data"],
  persons: FactPersonResponse[],
): Partial<FactStatementForm> {
  const { applicants, owners } = mapFactPersons(persons);
  const applicantMapped = applicants[0];
  const applicantRaw = persons.find((p) => p.id === applicantMapped?.id);
  const ownerMapped = owners[0];
  const ownerRaw = persons.find((p) => p.id === ownerMapped?.id);

  const day = (value: string | null | undefined) => value?.slice(0, 10) ?? "";
  const nonworking =
    app.trService?.price === FactStatementFee.nonworking ||
    text(app.trService?.name).includes("არასამუშაო");

  const patch: Partial<FactStatementForm> = {
    organization: text(app.agency?.name),
    fee: nonworking ? "nonworking" : "working",
    factDateFrom: day(app.fixedDayFrom),
    factDateTo: day(app.fixedDayTo),
    factHourFrom: hourText(app.fixedHourFrom),
    factHourTo: hourText(app.fixedHourTo),
    propertyType: text(app.appNote?.propertyType?.name),
    cadCode: text(app.appNote?.cadCode),
    placeAddress: text(app.appNote?.propertyAddress),
    request: text(app.appNote?.request),
  };

  if (applicantRaw) {
    const legal = Boolean(text(applicantRaw.organization));
    patch.applicantKind = legal ? "legal" : "physical";
    patch.applicantOrgName = text(applicantRaw.organization);
    patch.applicantFirstName = text(applicantRaw.firstName);
    patch.applicantLastName = text(applicantRaw.lastName);
    patch.applicantPersonalId = text(applicantRaw.idnumber);
    patch.applicantActualAddress = applicantMapped?.factualAddress ?? "";
    patch.applicantLegalAddress = applicantMapped?.legalAddress ?? "";
    // Phone & email are auto-filled + required: without carrying them back from
    // the saved statement the edit form opens with an empty (required) phone
    // and the statement can no longer be closed/re-recorded. They live in the
    // `contacts[]` array (keyed by type), not as top-level person fields.
    patch.applicantPhone = contactByType(applicantRaw.contacts, [
      "PHONE",
      "MOBILE",
    ]);
    patch.applicantEmail = contactByType(applicantRaw.contacts, ["EMAIL"]);
  }

  if (ownerRaw) {
    const legal = Boolean(text(ownerRaw.organization));
    patch.ownerKind = legal ? "legal" : "physical";
    patch.ownerLegalName = text(ownerRaw.organization);
    patch.ownerFirstName = text(ownerRaw.firstName);
    patch.ownerLastName = text(ownerRaw.lastName);
    if (legal) {
      patch.ownerLegalCode = text(ownerRaw.idnumber);
    } else {
      patch.ownerPersonalId = text(ownerRaw.idnumber);
    }
    patch.ownerAddress = ownerMapped?.address ?? "";
  }

  return patch;
}
