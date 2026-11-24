import { FactStatementFee } from "@/constants/fact-statement";
import i18n from "@/i18n/i18n";
import { parseOptionList } from "@/lib/fact-statement-helpers";
import { mapFactPersons } from "@/lib/map-fact-persons";
import type { FactStatementForm } from "@/types/fact-statement";
import {
  FactPersonType,
  type FactAppDetailResponse,
  type FactAppPayload,
  type FactAppPersonContactPayload,
  type FactAppPersonPayload,
  type FactPersonResponse,
} from "@/types/facts";

/** 4 = სამუშაო დრო (200₾), 5 = არასამუშაო დრო (300₾). */
const TR_SERVICE_ID: Record<FactStatementForm["fee"], number> = {
  working: 4,
  nonworking: 5,
};
/** 1 = ფიზიკური, 2 = იურიდიული. */
const PERSON_TYPE_PHYSICAL = 1;
const PERSON_TYPE_LEGAL = 2;

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
 * dictionaries are keyed by id. The option lists are parallel across locales
 * and ordered to match the backend dictionary, so the picked label's position
 * (+1, ids are 1-based) is its dictionary id. `fallback` is used when nothing
 * matches (e.g. an empty optional field).
 */
function optionId(
  picked: string,
  localizedJoined: string,
  fallback: number | null,
): number | null {
  const options = parseOptionList(localizedJoined);
  const index = options.findIndex((option) => option.label === picked.trim());
  return index >= 0 ? index + 1 : fallback;
}

const text = (value: string | null | undefined) => value?.trim() ?? "";

/** Phone / email → keyed `contacts[]` rows; empty values are dropped. */
function buildContacts(
  phone: string | null | undefined,
  email: string | null | undefined,
): FactAppPersonContactPayload[] {
  const contacts: FactAppPersonContactPayload[] = [];
  const mobile = text(phone);
  if (mobile) contacts.push({ type: "MOBILE", contact: mobile });
  const mail = text(email);
  if (mail) contacts.push({ type: "EMAIL", contact: mail });
  return contacts;
}

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
 * statement form. Live-verified contract (test gateway, 2026-11-09): dictionary
 * rows are referenced by **id** (agencyId / trServiceId / propertyTypeId /
 * appPersonTypeId / personTypeId), addresses use REAL/LEGAL with region ids,
 * and phone + email are `contacts[]` rows — NOT top-level fields. The backend
 * also overrides the applicant with the authenticated user's identity.
 */
export function buildFactAppPayload(form: FactStatementForm): FactAppPayload {
  const applicant: FactAppPersonPayload = {
    appPersonTypeId: FactPersonType.applicant,
    personTypeId:
      form.applicantKind === "legal" ? PERSON_TYPE_LEGAL : PERSON_TYPE_PHYSICAL,
    firstName: form.applicantKind === "legal" ? null : text(form.applicantFirstName),
    lastName: form.applicantKind === "legal" ? null : text(form.applicantLastName),
    organization:
      form.applicantKind === "legal" ? text(form.applicantOrgName) : null,
    idnumber: text(form.applicantPersonalId),
    pasport: false,
    contactInfo: null,
    addresses: [
      {
        type: "REAL",
        regionId: 0,
        districtId: 0,
        cityId: 0,
        address: text(form.applicantActualAddress),
      },
      ...(text(form.applicantLegalAddress)
        ? [
            {
              type: "LEGAL",
              regionId: 0,
              districtId: 0,
              cityId: 0,
              address: text(form.applicantLegalAddress),
            },
          ]
        : []),
    ],
    contacts: buildContacts(form.applicantPhone, form.applicantEmail),
  };

  const persons: FactAppPersonPayload[] = [applicant];
  if (form.ownerKind !== "none") {
    persons.push({
      appPersonTypeId: FactPersonType.owner,
      personTypeId:
        form.ownerKind === "legal" ? PERSON_TYPE_LEGAL : PERSON_TYPE_PHYSICAL,
      firstName: form.ownerKind === "legal" ? null : text(form.ownerFirstName),
      lastName: form.ownerKind === "legal" ? null : text(form.ownerLastName),
      organization: form.ownerKind === "legal" ? text(form.ownerLegalName) : null,
      idnumber: text(
        form.ownerKind === "legal" ? form.ownerLegalCode : form.ownerPersonalId,
      ),
      pasport: false,
      contactInfo: null,
      addresses: [
        {
          type: "REAL",
          regionId: 0,
          districtId: 0,
          cityId: 0,
          address: text(form.ownerAddress),
        },
      ],
      contacts: [],
    });
  }

  return {
    data: {
      agencyId: optionId(form.organization, i18n.t("facts.stBureauOptions"), 1) ?? 1,
      trServiceId: TR_SERVICE_ID[form.fee],
      fixedDayFrom: form.factDateFrom,
      fixedDayTo: form.factDateTo,
      fixedHourFrom: hourNumber(form.factHourFrom),
      fixedHourTo: hourNumber(form.factHourTo),
      appNote: {
        propertyTypeId: text(form.propertyType)
          ? optionId(form.propertyType, i18n.t("facts.stPropertyTypeOptions"), null)
          : null,
        cadCode: text(form.cadCode) || null,
        propertyAddress: text(form.placeAddress),
        request: text(form.request),
        otherDocs: null,
        note: null,
        officeNote: null,
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
