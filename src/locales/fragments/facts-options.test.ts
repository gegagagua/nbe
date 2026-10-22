import { describe, expect, it } from "@jest/globals";

import { parseOptionList } from "@/lib/fact-statement-helpers";
import { enFacts } from "@/locales/fragments/en-facts";
import { kaFacts } from "@/locales/fragments/ka-facts";

describe("bureau options (bug 1)", () => {
  const ka = parseOptionList(kaFacts.stBureauOptions);

  it("lists all 15 bureaus, not the old 6", () => {
    expect(ka).toHaveLength(15);
    expect(parseOptionList(enFacts.stBureauOptions)).toHaveLength(15);
  });

  it("starts with the full Tbilisi enforcement bureau name", () => {
    expect(ka[0].label).toBe("თბილისის სააღსრულებო ბიურო");
  });

  it("includes the specialised entries from the spec screenshot", () => {
    const labels = ka.map((o) => o.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        "ქვემო ქართლის სააღსრულებო ბიურო",
        "სპეციალური სამსახური",
        "აღსრულების ეროვნული ბიურო",
        "აღსრულების პოლიცია (დელეგირებული ფუნქციები)",
        "სატესტო ბიურო",
        "გადახდისუუნარობის საქმის წარმოების დეპარტამენტი",
      ]),
    );
  });

  it("drops the old placeholder bureaus", () => {
    const labels = ka.map((o) => o.label);
    expect(labels).not.toContain("ქუთაისის ბიურო");
    expect(labels).not.toContain("ზუგდიდის ბიურო");
  });
});

describe("property-type options (bug 5)", () => {
  it("is exactly the four spec values", () => {
    expect(parseOptionList(kaFacts.stPropertyTypeOptions).map((o) => o.label)).toEqual(
      ["პირადი საკუთრება", "საზოგადოებრივი", "სხვა", "დაუდგენელია"],
    );
    expect(parseOptionList(enFacts.stPropertyTypeOptions)).toHaveLength(4);
  });

  it("no longer contains the old real-estate values", () => {
    const labels = parseOptionList(kaFacts.stPropertyTypeOptions).map((o) => o.label);
    expect(labels).not.toContain("საცხოვრებელი უძრავი ქონება");
    expect(labels).not.toContain("მოძრავი ქონება");
  });
});

describe("new labels & removed keys", () => {
  it("adds the split address labels (bug 3)", () => {
    expect(kaFacts.stActualAddressLabel).toBe("ფაქტობრივი მისამართი");
    expect(kaFacts.stLegalAddressLabel).toBe("იურიდიული მისამართი");
  });

  it("adds date-range labels (bug 4)", () => {
    expect(kaFacts.stDateFrom).toBe("დღე (დან)");
    expect(kaFacts.stDateTo).toBe("დღე (მდე)");
  });

  it("adds preliminary-number and registration-date labels (bugs 7, 8 + date)", () => {
    expect(kaFacts.stPreliminaryNumberLabel).toBe("საქმის წინასწარი ნომერი");
    expect(kaFacts.stRegDateLabel).toBe("რეგისტრაციის თარიღი");
  });

  it("removes the obsolete single-address / calendar keys", () => {
    expect("stApplicantAddressLabel" in kaFacts).toBe(false);
    expect("stCalendarLabel" in kaFacts).toBe(false);
  });
});

describe("ka / en key parity", () => {
  it("both locales expose the same keys", () => {
    expect(Object.keys(kaFacts).sort()).toEqual(Object.keys(enFacts).sort());
  });
});
