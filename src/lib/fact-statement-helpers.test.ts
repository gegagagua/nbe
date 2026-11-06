import { describe, expect, it } from "@jest/globals";

import {
  formatCaseDate,
  hasMissingRequired,
  mergeApplicantLegalEntity,
  mergeApplicantProfile,
  parseOptionList,
} from "@/lib/fact-statement-helpers";
import type { FactStatementForm } from "@/types/fact-statement";
import { emptyFactStatementForm } from "@/types/fact-statement";
import type { LegalEntity } from "@/types/users";

/** A fully-filled, valid form (all required fields present, no owner). */
function validForm(overrides: Partial<FactStatementForm> = {}): FactStatementForm {
  return {
    ...emptyFactStatementForm(),
    organization: "თბილისის სააღსრულებო ბიურო",
    applicantFirstName: "ელენე",
    applicantLastName: "ლეთოდიანი",
    applicantPersonalId: "62902015177",
    applicantActualAddress: "ფაქტობრივი 1",
    applicantPhone: "123123123",
    factDateFrom: "2026-10-01",
    factDateTo: "2026-10-05",
    factHourFrom: "09:00",
    factHourTo: "18:00",
    propertyType: "პირადი საკუთრება",
    placeAddress: "მისამართი 1",
    request: "მოთხოვნის ტექსტი",
    ...overrides,
  };
}

describe("formatCaseDate", () => {
  it("formats as DD.MM.YYYY with zero padding (Confluence parity)", () => {
    expect(formatCaseDate(new Date(2026, 9, 6))).toBe("06.10.2026"); // 6 Oct 2026
    expect(formatCaseDate(new Date(2026, 0, 1))).toBe("01.01.2026");
    expect(formatCaseDate(new Date(2026, 11, 31))).toBe("31.12.2026");
  });
});

describe("parseOptionList", () => {
  it("splits on pipes, trims, and drops empties", () => {
    expect(parseOptionList(" a | b || c ")).toEqual([
      { value: "a", label: "a" },
      { value: "b", label: "b" },
      { value: "c", label: "c" },
    ]);
  });
});

describe("hasMissingRequired", () => {
  it("passes a fully filled form", () => {
    expect(hasMissingRequired(validForm())).toBe(false);
  });

  it("requires the actual address but NOT the legal address (bug 3)", () => {
    expect(hasMissingRequired(validForm({ applicantActualAddress: "" }))).toBe(
      true,
    );
    // Legal address stays optional.
    expect(hasMissingRequired(validForm({ applicantLegalAddress: "" }))).toBe(
      false,
    );
  });

  it("requires both ends of the date range (bug 4)", () => {
    expect(hasMissingRequired(validForm({ factDateFrom: "" }))).toBe(true);
    expect(hasMissingRequired(validForm({ factDateTo: "" }))).toBe(true);
  });

  it("requires name, surname, personal id, phone, property type, request", () => {
    expect(hasMissingRequired(validForm({ applicantFirstName: "" }))).toBe(true);
    expect(hasMissingRequired(validForm({ applicantLastName: "" }))).toBe(true);
    expect(hasMissingRequired(validForm({ applicantPersonalId: "" }))).toBe(true);
    expect(hasMissingRequired(validForm({ applicantPhone: "" }))).toBe(true);
    expect(hasMissingRequired(validForm({ propertyType: "" }))).toBe(true);
    expect(hasMissingRequired(validForm({ request: "" }))).toBe(true);
  });

  it("requires დასახელება + საიდენტიფიკაციო კოდი for a legal applicant, not name/surname", () => {
    const legal = validForm({
      applicantKind: "legal",
      applicantFirstName: "",
      applicantLastName: "",
      applicantOrgName: "შპს თერი",
    });
    // Company name present, name/surname empty → still valid.
    expect(hasMissingRequired(legal)).toBe(false);
    // Company name missing → invalid.
    expect(hasMissingRequired({ ...legal, applicantOrgName: "" })).toBe(true);
    // The identifier (საიდენტიფიკაციო კოდი) is still required.
    expect(hasMissingRequired({ ...legal, applicantPersonalId: "" })).toBe(true);
  });

  it("validates owner fields only once an owner kind is picked", () => {
    expect(hasMissingRequired(validForm({ ownerKind: "none" }))).toBe(false);
    expect(hasMissingRequired(validForm({ ownerKind: "physical" }))).toBe(true);
    expect(
      hasMissingRequired(
        validForm({
          ownerKind: "physical",
          ownerPersonalId: "01024085678",
          ownerFirstName: "ა",
          ownerLastName: "ბ",
          ownerAddress: "მის.",
        }),
      ),
    ).toBe(false);
    expect(
      hasMissingRequired(
        validForm({
          ownerKind: "legal",
          ownerLegalCode: "405123456",
          ownerLegalName: "შპს",
          ownerAddress: "მის.",
        }),
      ),
    ).toBe(false);
  });

  it("treats whitespace-only as empty", () => {
    expect(hasMissingRequired(validForm({ request: "   " }))).toBe(true);
  });
});

describe("mergeApplicantProfile", () => {
  it("fills empty applicant fields from the profile (bugs 2 & 3)", () => {
    const merged = mergeApplicantProfile(emptyFactStatementForm(), {
      applicantFirstName: "ელენე",
      applicantLastName: "ლეთოდიანი",
      applicantPersonalId: "62902015177",
      applicantActualAddress: "ფაქტობრივი მის.",
      applicantLegalAddress: "იურიდიული მის.",
    });
    expect(merged.applicantFirstName).toBe("ელენე");
    expect(merged.applicantLastName).toBe("ლეთოდიანი");
    expect(merged.applicantPersonalId).toBe("62902015177");
    expect(merged.applicantActualAddress).toBe("ფაქტობრივი მის.");
    expect(merged.applicantLegalAddress).toBe("იურიდიული მის.");
  });

  it("does NOT overwrite values the user already typed", () => {
    const base = mergeApplicantProfile(emptyFactStatementForm(), {
      applicantFirstName: "ხელით",
      applicantActualAddress: "ხელით მის.",
    });
    const merged = mergeApplicantProfile(base, {
      applicantFirstName: "პროფილი",
      applicantActualAddress: "პროფილის მის.",
    });
    expect(merged.applicantFirstName).toBe("ხელით");
    expect(merged.applicantActualAddress).toBe("ხელით მის.");
  });

  it("tolerates null/undefined patch fields", () => {
    const merged = mergeApplicantProfile(emptyFactStatementForm(), {
      applicantFirstName: null,
      applicantLegalAddress: undefined,
    });
    expect(merged.applicantFirstName).toBe("");
    expect(merged.applicantLegalAddress).toBe("");
  });

  it("does not touch non-applicant fields", () => {
    const form = validForm({ request: "დაცული" });
    const merged = mergeApplicantProfile(form, { applicantFirstName: "x" });
    expect(merged.request).toBe("დაცული");
    expect(merged.propertyType).toBe(form.propertyType);
  });
});

describe("mergeApplicantLegalEntity", () => {
  const entity: LegalEntity = {
    id: 7,
    name: "შპს თერი",
    legalNumber: "202205684",
    memberTypeId: null,
    memberName: "დირექტორი",
    address: "იურიდიული მის. 1",
    realAddress: "ფაქტობრივი მის. 2",
    email: "test@test.com",
  };

  it("switches to legal mode and fills the company field set", () => {
    const merged = mergeApplicantLegalEntity(emptyFactStatementForm(), entity);
    expect(merged.applicantKind).toBe("legal");
    expect(merged.applicantOrgName).toBe("შპს თერი");
    expect(merged.applicantPersonalId).toBe("202205684"); // საიდენტიფიკაციო კოდი
    expect(merged.applicantActualAddress).toBe("ფაქტობრივი მის. 2");
    expect(merged.applicantLegalAddress).toBe("იურიდიული მის. 1");
    expect(merged.applicantEmail).toBe("test@test.com");
  });

  it("does not overwrite values the user already typed", () => {
    const base = {
      ...emptyFactStatementForm(),
      applicantOrgName: "ხელით",
      applicantLegalAddress: "ხელით მის.",
    };
    const merged = mergeApplicantLegalEntity(base, entity);
    expect(merged.applicantOrgName).toBe("ხელით");
    expect(merged.applicantLegalAddress).toBe("ხელით მის.");
  });

  it("tolerates null entity fields", () => {
    const merged = mergeApplicantLegalEntity(emptyFactStatementForm(), {
      ...entity,
      address: null,
      realAddress: null,
      email: null,
    });
    expect(merged.applicantLegalAddress).toBe("");
    expect(merged.applicantActualAddress).toBe("");
    expect(merged.applicantEmail).toBe("");
  });
});

