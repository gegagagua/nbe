export type FactApplicationParty = {
  /** person record id (`persons/app/{appId}` → `id`), when the list returns it */
  id?: number;
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

// ── Single statement (GET /fact-portal/v1/apps/{id}) ──────────────────────────
type FactNamedRef = { id: number; name: string };

export type FactAppNote = {
  request: string | null;
  otherDocs: string | null;
  note: string | null;
  officeNote: string | null;
  propertyAddress: string | null;
  cadCode: string | null;
  propertyType: FactNamedRef | null;
};

export type FactAppDetailResponse = {
  data: {
    id: number;
    createdDate: string;
    createdBy: FactNamedRef | null;
    inputDate: string | null;
    statusDate: string | null;
    agency: FactNamedRef | null;
    trType: FactNamedRef | null;
    service: FactNamedRef | null;
    status: FactNamedRef | null;
    trService: (FactNamedRef & { price: number | null }) | null;
    regnumber: string | null;
    regDate: string | null;
    fixedDayFrom: string | null;
    fixedDayTo: string | null;
    fixedHourFrom: number | null;
    fixedHourTo: number | null;
    appNote: FactAppNote | null;
  };
};

// ── Persons (GET /fact-portal/v1/persons/app/{appId}) ─────────────────────────
/** `appPersonType.id` values used on the detail page. */
export const FactPersonType = {
  applicant: 1,
  owner: 3,
} as const;

export type FactPersonResponse = {
  id: number;
  appId: number;
  appPersonType: FactNamedRef | null;
  personType: FactNamedRef | null;
  firstName: string | null;
  lastName: string | null;
  organization: string | null;
  idnumber: string | null;
  addresses:
    | {
        id: number;
        type: string;
        region: FactNamedRef | null;
        city: FactNamedRef | null;
        address: string | null;
      }[]
    | null;
  payCode: string | null;
};

export type FactPerson = {
  id: number;
  /** სახელი, გვარი / ორგანიზაციის დასახელება */
  name: string;
  /** პირადი ნომერი / საიდ. კოდი */
  idnumber: string;
  address: string;
  payCode: string;
};

export type FactAppDetail = {
  id: number;
  regnumber: string;
  /** date-only, shown next to the clock icon in the header */
  date: string;
  bureauName: string;
  /** ფაქტის დადგენის დრო (დან / მდე) */
  factTimeFrom: string;
  factTimeTo: string;
  propertyType: string;
  cadCode: string;
  propertyAddress: string;
  feeName: string;
  request: string;
};
