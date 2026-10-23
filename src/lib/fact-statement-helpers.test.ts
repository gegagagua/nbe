import { describe, expect, it } from "@jest/globals";

import {
  formatCaseDate,
  hasMissingRequired,
  mergeApplicantProfile,
  mintRegistrationNumber,
  mintStatementIdentifiers,
  parseOptionList,
} from "@/lib/fact-statement-helpers";
import type { FactStatementForm } from "@/types/fact-statement";
import { emptyFactStatementForm } from "@/types/fact-statement";

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

describe("mintStatementIdentifiers / mintRegistrationNumber", () => {
  it("mints a 5-digit preliminary number and a distinct 11-digit payment id (bugs 6-8)", () => {
    const now = new Date(2026, 9, 22, 13, 47, 12);
    const { preliminaryNumber, payIdentifier } = mintStatementIdentifiers(now);
    expect(preliminaryNumber).toMatch(/^\d{5}$/);
    expect(payIdentifier).toMatch(/^\d{11}$/);
    // The two identifiers are not the same value.
    expect(preliminaryNumber).not.toBe(payIdentifier);
    // The preliminary number is the tail of the longer payment id.
    expect(payIdentifier.endsWith(preliminaryNumber)).toBe(true);
  });

  it("mints an F{year}… registration number", () => {
    const now = new Date(2026, 9, 22, 13, 47, 12);
    expect(mintRegistrationNumber(now)).toMatch(/^F2026\d{6}$/);
  });
});
