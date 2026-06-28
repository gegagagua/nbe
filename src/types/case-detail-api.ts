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

// ── MIA properties (შსს ქონების სია) ───────────────────────────────────────────
// POST /mia-portal/v1/properties/get-all — body { data: { appId, appPersonTypeId } }.
export type EpsMiaRef = { id: number; name: string | null };

export type EpsMiaProperty = {
  id: number;
  person: EpsMiaRef | null;
  propertyType: EpsMiaRef | null;
  propertySt: EpsMiaRef | null;
  model: string | null;
  govNumber: string | null;
  address: string | null;
  reqCode: string | null;
  reqCreatedBy: EpsMiaRef | null;
  reqCreatedDate: string | null;
};

export type EpsMiaPropertiesEnvelope = { data: EpsMiaProperty[] };

// ── SSA requests (სოციალური მომსახურების სააგენტო) ──────────────────────────────
// POST /ssa-portal/v1/ssa-requests/by-app-id — body { data: { appId } }.
export type EpsSsaPerson = {
  id: number;
  idnumber: string | null;
  // Some EPS services return a split first/last name; others (the common case)
  // return a single pre-formatted `name` like every other person ref. Accept
  // both so the identity always renders.
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
};

export type EpsSsaRequest = {
  id: number;
  person: EpsSsaPerson | null;
  address: string | null;
  phone: string | null;
  sent: boolean | null;
  active: boolean | null;
  lastCheckDate: string | null;
  underProverty: boolean | null;
};

export type EpsSsaRequestsEnvelope = { data: EpsSsaRequest[] };

// ── NAPR landreg (საჯარო რეესტრი) ──────────────────────────────────────────────
// POST /napr-portal/v1/landreg/infos/by-app-id        — my.gov.ge requests sent.
// POST /napr-portal/v1/landreg/real-estates/by-app-id — real estate found.
export type EpsLandregPerson = { id: number; name: string | null };

export type EpsLandregInfo = {
  id: number;
  person: EpsLandregPerson | null;
  sent: number | null; // 1 = sent
  sendDate: string | null;
  answer: number | null; // 0 = not found, anything else = found
};

export type EpsLandregInfosEnvelope = { data: EpsLandregInfo[] };

export type EpsLandregRealEstate = {
  id: number;
  person: EpsLandregPerson | null;
  cadCode: string | null;
  address: string | null;
  owner: boolean | null;
  status: { id: number; name: string | null; active?: boolean } | null;
};

export type EpsLandregRealEstatesEnvelope = { data: EpsLandregRealEstate[] };

// ── NAPR enreg (სამეწარმეო რეესტრი) ─────────────────────────────────────────────
// POST /napr-portal/v1/enreg/infos/by-app-id — business notifications.
export type EpsEnregInfo = {
  id: number;
  createdBy: EpsLandregPerson | null;
  person: EpsLandregPerson | null;
  sent: number | null; // 1 = sent
  sendDate: string | null;
  answer: number | null;
  soleTrader: boolean | null;
};

export type EpsEnregInfosEnvelope = { data: EpsEnregInfo[] };

// POST /napr-portal/v1/enreg/active-shares/by-app-id — active shares owned.
export type EpsEnregActiveShare = {
  id: number;
  person: EpsLandregPerson | null;
  name: string | null;
  idnumber: string | null;
  govRegDate: string | null;
  activeShare: number | null;
  status: { id: number; name: string | null } | null;
};

export type EpsEnregActiveSharesEnvelope = { data: EpsEnregActiveShare[] };

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

// ── Funds / registered money (ინფორმაცია თანხებზე) ─────────────────────────────
// GET /money-portal/v1/reg-money/debtor/app/{appId}
// GET /money-portal/v1/reg-money/creditor/app/{appId}

/** A creditor (appPersonType 1) / debtor (appPersonType 2) on the money tab. */
export type EpsMoneyPerson = {
  /** Numeric here (not the {id,name} object): 1 = creditor, 2 = debtor. */
  appPersonType: number | null;
  personType?: number | null;
  firstName: string | null;
  lastName: string | null;
  organization: string | null;
  idnumber: string | null;
  payCode: string | null;
};

/** One registered-money row (per demand / currency). */
export type EpsMoneyRow = {
  name: string | null;
  /** Total due (სულ გადასახდელი). */
  amount: number | null;
  /** Total paid (სულ გადახდილი). */
  transfer: number | null;
  /** Paid directly. */
  transferManual?: number | null;
  valutaName: string | null;
};

/** Totals across a group of money rows. */
export type EpsMoneySum = {
  amount: number | null;
  transfer: number | null;
  transferManual: number | null;
};

/**
 * One element of the reg-money `data` array. The two endpoints differ:
 *   • debtor   → `monies` + `moneySum`
 *   • creditor → `credDemand`/`credDebt` + `credDemandSum`/`credDebtSum`
 * Both carry the same `persons` list (keyed by appPersonType).
 */
export type EpsMoneyDataItem = {
  monies?: EpsMoneyRow[] | null;
  moneySum?: EpsMoneySum | null;
  credDemand?: EpsMoneyRow[] | null;
  credDemandSum?: EpsMoneySum | null;
  credDebt?: EpsMoneyRow[] | null;
  credDebtSum?: EpsMoneySum | null;
  persons?: EpsMoneyPerson[] | null;
  [key: string]: unknown;
};

/** `data` is an array with a single element; object form tolerated defensively. */
export type EpsMoneyEnvelope = {
  data: EpsMoneyDataItem[] | EpsMoneyDataItem | null;
};
