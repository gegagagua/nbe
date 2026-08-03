export type FactApplicationParty = {
  name: string;
  idnumber: string;
};

export type FactApplicationStatus = {
  /** e.g. "წინასწარი განცხადება" */
  label: string;
  /** formatted date-time, e.g. "10.07.2026 17:52:55" */
  date: string;
  /** e.g. "სამუშაო დრო (200 ლარი)" */
  fee: string;
  /** e.g. "პირადი საკუთრება" */
  ownershipType: string;
};

export type FactApplication = {
  id: number;
  /** highlighted reference number shown on the card, e.g. "F26096532" */
  referenceNumber?: string;
  /** enforcement bureau name */
  bureauName: string;
  /** internal case number, e.g. "96533" */
  caseNumber: string;
  /** formatted registration date-time */
  registeredAt: string;
  /** current phase/status of the fact statement (optional) */
  status?: FactApplicationStatus;
  /** enforcement officer full name (may be empty) */
  executor?: string;
  /** applicant (declarant) */
  applicant: FactApplicationParty;
};

export type FactsPage = {
  data: FactApplication[];
  totalPages: number;
  totalRecords: number;
};

// ── Search request (POST /fact-portal/v1/apps/search) ─────────────────────────
export type FactsSearchFilters = {
  /** რეგისტრაციის ნომერი */
  regnumber?: string;
  /** რეგისტრაციის თარიღი — from / to (YYYY-MM-DD) */
  regDateFrom?: string;
  regDateTo?: string;
  idnumber?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  organization?: string;
  /** გადახდის იდენტიფიკატორი */
  payCode?: string;
};

export type FactsSearchPerson = {
  idnumber?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  organization?: string;
};

export type FactsSearchRequest = {
  data: {
    regnumber?: string;
    regDateFrom?: string;
    regDateTo?: string;
    /** გადახდის იდენტიფიკატორი — backend filter field name */
    Paycode?: string;
    person?: FactsSearchPerson;
  };
  page: { number: number; size: number };
  sort?: { property: string; direction: "ASC" | "DESC" }[];
};
