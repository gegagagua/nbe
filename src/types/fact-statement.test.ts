import { describe, expect, it } from "@jest/globals";

import { emptyFactStatementForm } from "@/types/fact-statement";

describe("emptyFactStatementForm shape", () => {
  const form = emptyFactStatementForm();

  it("splits the applicant address into actual + legal (bug 3)", () => {
    expect(form).toHaveProperty("applicantActualAddress", "");
    expect(form).toHaveProperty("applicantLegalAddress", "");
    expect("applicantAddress" in form).toBe(false);
  });

  it("uses a factDateFrom / factDateTo range instead of a single date (bug 4)", () => {
    expect(form).toHaveProperty("factDateFrom", "");
    expect(form).toHaveProperty("factDateTo", "");
    expect("factDate" in form).toBe(false);
    // The time range is kept.
    expect(form).toHaveProperty("factHourFrom", "");
    expect(form).toHaveProperty("factHourTo", "");
  });
});
