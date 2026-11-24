import { describe, expect, it, jest } from "@jest/globals";

import { kaFacts } from "@/locales/fragments/ka-facts";
import { parseOptionList } from "@/lib/fact-statement-helpers";
import { emptyFactStatementForm } from "@/types/fact-statement";

// Stub the i18n module so this stays a pure (RN-free) test: the real one pulls
// in expo-localization (ESM, untransformed in node_modules). The builder only
// reads the two localized option lists; serve the Georgian ones so option→id
// resolution (by list position) is deterministic.
jest.mock("@/i18n/i18n", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { kaFacts: ka } = require("@/locales/fragments/ka-facts");
  const table: Record<string, string> = {
    "facts.stBureauOptions": ka.stBureauOptions,
    "facts.stPropertyTypeOptions": ka.stPropertyTypeOptions,
  };
  return {
    __esModule: true,
    default: { t: (key: string) => table[key] ?? key },
  };
});

// Keeps react-native (Platform) out of this node-env test — the builder only
// needs the fee table from this module.
jest.mock("@/constants/fact-statement", () => ({
  FactStatementFee: { working: 200, nonworking: 300 },
}));

// eslint-disable-next-line import/first
import { buildFactAppPayload } from "@/lib/fact-statement-payload";

const bureaus = parseOptionList(kaFacts.stBureauOptions);
const propertyTypes = parseOptionList(kaFacts.stPropertyTypeOptions);

function physicalApplicantForm() {
  return {
    ...emptyFactStatementForm(),
    organization: bureaus[0].label, // თბილისის სააღსრულებო ბიურო → agencyId 1
    applicantKind: "physical" as const,
    applicantFirstName: "ვაკო",
    applicantLastName: "წიკლაური",
    applicantPersonalId: "01024085000",
    applicantActualAddress: "თბილისი, ვაჟა-ფშაველას 1",
    applicantLegalAddress: "თბილისი, რუსთაველის 2",
    applicantPhone: "599123456",
    applicantEmail: "vako@example.ge",
    fee: "working" as const,
    factDateFrom: "2026-11-25",
    factDateTo: "2026-11-25",
    factHourFrom: "09:00",
    factHourTo: "18:00",
    propertyType: propertyTypes[0].label, // პირადი საკუთრება → propertyTypeId 1
    cadCode: "",
    placeAddress: "თბილისი, ჭავჭავაძის 3",
    request: "გთხოვთ ფაქტის კონსტატაციას",
  };
}

describe("buildFactAppPayload — live-verified ID contract", () => {
  it("references dictionary rows by id, never by name object", () => {
    const { data } = buildFactAppPayload(physicalApplicantForm());

    // No legacy name-object shapes leak through (the old failing guess).
    expect((data as Record<string, unknown>).agency).toBeUndefined();
    expect((data as Record<string, unknown>).trService).toBeUndefined();

    expect(data.agencyId).toBe(1);
    expect(data.trServiceId).toBe(4); // სამუშაო დრო
    expect(data.appNote.propertyTypeId).toBe(1); // პირადი საკუთრება
    expect(data.fixedHourFrom).toBe(9);
    expect(data.fixedHourTo).toBe(18);
  });

  it("maps არასამუშაო დრო to trServiceId 5", () => {
    const { data } = buildFactAppPayload({
      ...physicalApplicantForm(),
      fee: "nonworking",
    });
    expect(data.trServiceId).toBe(5);
  });

  it("sends appNote with the full key set and null-able optionals", () => {
    const { data } = buildFactAppPayload({
      ...physicalApplicantForm(),
      cadCode: "",
    });
    expect(data.appNote).toMatchObject({
      cadCode: null,
      propertyAddress: "თბილისი, ჭავჭავაძის 3",
      request: "გთხოვთ ფაქტის კონსტატაციას",
      otherDocs: null,
      note: null,
      officeNote: null,
    });
  });

  it("puts phone/email in contacts[], not as top-level person fields", () => {
    const { data } = buildFactAppPayload(physicalApplicantForm());
    const applicant = data.persons[0];

    expect((applicant as Record<string, unknown>).phone).toBeUndefined();
    expect((applicant as Record<string, unknown>).email).toBeUndefined();
    expect(applicant.contacts).toEqual([
      { type: "MOBILE", contact: "599123456" },
      { type: "EMAIL", contact: "vako@example.ge" },
    ]);
  });

  it("drops empty contacts rather than sending blank rows", () => {
    const { data } = buildFactAppPayload({
      ...physicalApplicantForm(),
      applicantPhone: "",
      applicantEmail: "",
    });
    expect(data.persons[0].contacts).toEqual([]);
  });

  it("emits REAL/LEGAL addresses with region ids; LEGAL only when present", () => {
    const withLegal = buildFactAppPayload(physicalApplicantForm()).data.persons[0];
    expect(withLegal.addresses).toEqual([
      { type: "REAL", regionId: 0, districtId: 0, cityId: 0, address: "თბილისი, ვაჟა-ფშაველას 1" },
      { type: "LEGAL", regionId: 0, districtId: 0, cityId: 0, address: "თბილისი, რუსთაველის 2" },
    ]);

    const noLegal = buildFactAppPayload({
      ...physicalApplicantForm(),
      applicantLegalAddress: "",
    }).data.persons[0];
    expect(noLegal.addresses).toHaveLength(1);
    expect(noLegal.addresses[0].type).toBe("REAL");
  });

  it("sets applicant person-type ids (applicant=1, physical=1) with pasport/contactInfo", () => {
    const applicant = buildFactAppPayload(physicalApplicantForm()).data.persons[0];
    expect(applicant.appPersonTypeId).toBe(1);
    expect(applicant.personTypeId).toBe(1);
    expect(applicant.pasport).toBe(false);
    expect(applicant.contactInfo).toBeNull();
    expect(applicant.firstName).toBe("ვაკო");
    expect(applicant.organization).toBeNull();
  });

  it("adds a legal owner as appPersonTypeId 3 / personTypeId 2", () => {
    const { data } = buildFactAppPayload({
      ...physicalApplicantForm(),
      ownerKind: "legal",
      ownerLegalName: "შპს ალფა",
      ownerLegalCode: "405123456",
      ownerAddress: "თბილისი, აღმაშენებლის 4",
    });
    expect(data.persons).toHaveLength(2);
    const owner = data.persons[1];
    expect(owner.appPersonTypeId).toBe(3);
    expect(owner.personTypeId).toBe(2);
    expect(owner.organization).toBe("შპს ალფა");
    expect(owner.idnumber).toBe("405123456");
    expect(owner.contacts).toEqual([]);
    expect(owner.addresses[0].type).toBe("REAL");
  });

  it("omits the owner entirely when ownerKind is none", () => {
    const { data } = buildFactAppPayload(physicalApplicantForm());
    expect(data.persons).toHaveLength(1);
  });
});
