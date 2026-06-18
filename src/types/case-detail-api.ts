// Raw response shapes for the EPS case-detail endpoints, verified against the
// testing gateway:
//   GET /eps-portal/v1/apps/{id}            → EpsAppDetailEnvelope
//   GET /eps-portal/v1/persons/app/{appId}  → EpsPersonsEnvelope
//   GET /eps-portal/v1/demands/app/{appId}  → EpsDemandsEnvelope

export type EpsAppPersonType = {
  id: number;
  name: string;
  description?: string;
  active: boolean;
};

export type EpsAddress = {
  id: number;
  type: string;
  address: string | null;
  city?: unknown;
};

/** A creditor / debtor / representative. */
export type EpsPerson = {
  id: number;
  /** appPersonType.id: 1 = creditor (კრედიტორი), 2 = debtor (მოვალე). */
  appPersonType: EpsAppPersonType | null;
  firstName: string | null;
  lastName: string | null;
  /** Set for legal entities; firstName/lastName are null in that case. */
  organization: string | null;
  idnumber: string | null;
  /** Unique payment identifier. */
  payCode?: string | null;
  addresses: EpsAddress[] | null;
  representatives: EpsPerson[] | null;
};

export type EpsTrType = {
  id: number;
  active: boolean;
  prefix: string | null;
  name: string | null;
  categoryId: number;
};

export type EpsAgency = { id: number; name: string };

export type EpsWritOfExecution = {
  id: number;
  initiatorName: string | null;
  initiatorAddress: string | null;
  docNo: string | null;
  docDate: string | null;
};

export type EpsAppDetail = {
  id: number;
  trType: EpsTrType | null;
  agencies: EpsAgency[] | null;
  regnumber: string | null;
  regDate: string | null;
  request: unknown;
  writOfExecution: EpsWritOfExecution | null;
};

export type EpsValuta = {
  id: number;
  name: string | null;
  description: string | null;
  active: boolean;
};

export type EpsDemand = {
  id: number;
  type: EpsAppPersonType | null;
  /** Enforcement amount in the demand currency (not tetri). */
  amount: number | null;
  valuta: EpsValuta | null;
  quantity: number | null;
  propertyType: unknown;
  note: string | null;
  limSolidary: boolean;
  creditors: EpsPerson[] | null;
  debtors: EpsPerson[] | null;
};

export type EpsStatusState = {
  id: number;
  name: string | null;
  active: boolean;
};

export type EpsStatusKind = {
  id: number;
  name: string | null;
  colorCode: string | null;
  state: EpsStatusState | null;
};

/** One proceeding ("წარმოება") entry from /app/{appId}/statuses. */
export type EpsAppStatusEntry = {
  id: number;
  createdDate: string | null;
  appId: number;
  status: EpsStatusKind | null;
  decision: unknown;
  statusNumber: string | null;
};

export type EpsFileMeta = {
  id: number;
  fileName: string | null;
  signStatus: string | null;
  fileDesc: string | null;
  sourceTypeId: number | null;
  mimeType: string | null;
  sourceId: number | null;
  nbsName: string | null;
};

/** One downloadable file attached to a proceeding status. */
export type EpsStatusFileEntry = {
  id: number;
  uploadedBy: { id: number; name: string | null } | null;
  createdDate: string | null;
  type: EpsAppPersonType | null;
  issued: boolean;
  file: EpsFileMeta | null;
};

export type EpsAppDetailEnvelope = { data: EpsAppDetail };
export type EpsPersonsEnvelope = { data: EpsPerson[] };
export type EpsDemandsEnvelope = { data: EpsDemand[] };
export type EpsStatusesEnvelope = { data: EpsAppStatusEntry[] };
export type EpsStatusFilesEnvelope = { data: EpsStatusFileEntry[] };

// ── Auction (აუქციონი) — POST /portal/v1/lots/by-app-id ────────────────────────
export type EpsLotCategory = {
  id: number;
  name: string | null;
  parent?: EpsLotCategory | null;
};

export type EpsLotAuction = {
  startDate: string | null;
  endDate: string | null;
  auctionType: string | null;
  eaucUrl: string | null;
};

export type EpsLot = {
  id: number;
  category: EpsLotCategory | null;
  price: number | null;
  url: string | null;
  name: string | null;
  number: string | null;
  winDate: string | null;
  winMoney: number | null;
  auctions: EpsLotAuction[] | null;
};

export type EpsLotsEnvelope = { data: EpsLot[] };

// ── Installment (განწილვადება) ─────────────────────────────────────────────────
// GET /portal/v1/installments/{id} — pass the appId as {id}.
export type EpsInstallmentDebtor = {
  id: number;
  // Note: backend spells this "idnubmer" (sic); idnumber kept as a fallback.
  idnubmer?: string | null;
  idnumber?: string | null;
  firstName: string | null;
  lastName: string | null;
  organization: string | null;
  payCode: string | null;
};

export type EpsInstallment = {
  id: number;
  debtors: EpsInstallmentDebtor[] | null;
  status: string | null;
  amount: number | null;
  valutaName: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type EpsInstallmentsEnvelope = { data: EpsInstallment[] };

// POST /portal/v1/installments/payment/by-installment-id
export type EpsInstallmentPaymentEntry = {
  id: number;
  createdDate: string | null;
  confirmedBy: { id: number; name: string | null } | null;
  installmentId: number;
  status: string | null;
  paymentDate: string | null;
  amountToPay: number | null;
  amountPayed: number | null;
  remainedAmount: number | null;
  confirmDate: string | null;
};

export type EpsInstallmentPaymentsEnvelope = {
  data: EpsInstallmentPaymentEntry[];
};
