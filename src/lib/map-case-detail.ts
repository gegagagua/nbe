import type {
  CaseDetailClaimRow,
  CaseDetailCreditorParty,
  CaseDetailCreditorRow,
  CaseDetailAuctionLot,
  CaseDetailData,
  CaseDetailDebtorRow,
  CaseDetailExtraInfoRow,
  CaseDetailFundsPartyInfo,
  CaseDetailInstallment,
  CaseDetailInstallmentPayment,
  CaseDetailBusinessNotifyRow,
  CaseDetailBusinessShareRow,
  CaseDetailProceedingFile,
  CaseDetailProceedingStatus,
  CaseDetailRegistryEstateRow,
  CaseDetailRegistryInfoRow,
  CaseDetailSearchPropertyRow,
  CaseDetailSocialRow,
  CaseDetailWritRow,
} from "@/types/case-detail-data";
import type {
  EpsAppDetail,
  EpsAppDetailEnvelope,
  EpsCaseExtraInfoEnvelope,
  EpsDemand,
  EpsDemandsEnvelope,
  EpsInstallment,
  EpsInstallmentPaymentsEnvelope,
  EpsLotsEnvelope,
  EpsMiaPropertiesEnvelope,
  EpsSsaRequestsEnvelope,
  EpsLandregInfosEnvelope,
  EpsLandregRealEstatesEnvelope,
  EpsEnregInfosEnvelope,
  EpsEnregActiveSharesEnvelope,
  EpsMoneyDataItem,
  EpsMoneyEnvelope,
  EpsMoneyPerson,
  EpsMoneyRow,
  EpsPerson,
  EpsPersonsEnvelope,
  EpsStatusesEnvelope,
  EpsStatusFilesEnvelope,
} from "@/types/case-detail-api";

/**
 * Fields of CaseDetailData backed by real endpoints: the header + application
 * tab, plus the proceedings ("წარმოება") sub-tab of the case-info tab.
 */
export type CaseDetailApplication = Pick<
  CaseDetailData,
  | "officialCaseNo"
  | "bureauLines"
  | "categoryRight"
  | "categoryPrefix"
  | "creditors"
  | "debtors"
  | "writRows"
  | "claimsSummary"
  | "claimRows"
  | "proceedings"
>;

/** Display name: organization for legal entities, otherwise first + last. */
function personName(p: EpsPerson): string {
  const org = p.organization?.trim();
  if (org) return org;
  return `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim();
}

function addressLines(p: EpsPerson): string[] {
  return (p.addresses ?? [])
    .map((a) => a.address?.trim() ?? "")
    .filter((line) => line.length > 0);
}

/** payCode is the unique payment identifier; fall back to idnumber. */
function paymentIdentifier(p: EpsPerson): string {
  return (p.payCode ?? p.idnumber ?? "").trim();
}

/** Party cell title, e.g. "სახელმწიფო ბიუჯეტი (0)". Keeps the idnumber. */
function partyWithId(p: EpsPerson): CaseDetailCreditorParty {
  const name = personName(p);
  const id = p.idnumber?.trim();
  return {
    titleLine: id ? `${name} (${id})` : name,
    addressLines: addressLines(p),
    paymentIdentifier: paymentIdentifier(p),
  };
}

/**
 * Label used inside the demand (claims) table. Physical persons carry their
 * idnumber in parentheses; legal entities show the organization name only.
 */
function claimPartyLabel(p: EpsPerson): string {
  const name = personName(p);
  if (p.organization?.trim()) return name;
  const id = p.idnumber?.trim();
  return id ? `${name} (${id})` : name;
}

/** "2026-04-22" or "2026-04-22T..." → "22/04/2026". */
function formatDocDate(raw: string | null): string {
  if (!raw) return "";
  const datePart = raw.slice(0, 10);
  const [yyyy, mm, dd] = datePart.split("-");
  if (!yyyy || !mm || !dd) return raw;
  return `${dd}/${mm}/${yyyy}`;
}

/** "2026-04-22T21:46:48" → "22/04/2026 21:46". */
function formatDateTime(raw: string | null): string {
  if (!raw) return "";
  const [datePart, timePart] = raw.split("T");
  const date = formatDocDate(datePart);
  const hhmm = (timePart ?? "").slice(0, 5);
  return hhmm ? `${date} ${hhmm}` : date;
}

function isCreditor(p: EpsPerson): boolean {
  return p.appPersonType?.id === 1;
}

function isDebtor(p: EpsPerson): boolean {
  return p.appPersonType?.id === 2;
}

function mapCreditorRow(p: EpsPerson): CaseDetailCreditorRow {
  const rep = (p.representatives ?? [])[0];
  return {
    party: partyWithId(p),
    representative: rep ? partyWithId(rep) : null,
  };
}

function mapDebtorRow(p: EpsPerson): CaseDetailDebtorRow {
  const party = partyWithId(p);
  return {
    titleLine: party.titleLine,
    addressLines: party.addressLines,
    paymentIdentifier: party.paymentIdentifier,
  };
}

function mapWritRows(app: EpsAppDetail): CaseDetailWritRow[] {
  const writ = app.writOfExecution;
  if (!writ) return [];
  return [
    {
      court: writ.initiatorName?.trim() ?? "",
      orderNo: writ.docNo?.trim() ?? "",
      orderDate: formatDocDate(writ.docDate),
    },
  ];
}

function mapClaimRow(demand: EpsDemand): CaseDetailClaimRow {
  const amount =
    demand.amount != null
      ? `${demand.amount} ${demand.valuta?.name ?? ""}`.trim()
      : "";
  return {
    amount,
    creditorsCell: (demand.creditors ?? []).map(claimPartyLabel).join(", "),
    debtorsCell: (demand.debtors ?? []).map(claimPartyLabel).join(", "),
  };
}

function categoryLabel(app: EpsAppDetail): string {
  const prefix = app.trType?.prefix?.trim();
  const name = app.trType?.name?.trim() ?? "";
  return prefix ? `${prefix} ${name}`.trim() : name;
}

/** Map the /app/{appId}/statuses list into proceedings rows. */
function mapProceedings(
  statusesEnvelope: EpsStatusesEnvelope,
): CaseDetailProceedingStatus[] {
  return (statusesEnvelope.data ?? []).map((entry) => ({
    codeLine: entry.statusNumber?.trim() ?? "",
    title: entry.status?.name?.trim() ?? "",
    dateTime: formatDateTime(entry.createdDate),
    // Documents are loaded on demand from the status-files endpoint, keyed by
    // these identifiers (see useStatusFiles).
    documents: [],
    appStatusId: entry.id,
    appId: entry.appId,
  }));
}

/** Map the lots/by-app-id response into auction lot cards. */
export function mapAuctionLots(env: EpsLotsEnvelope): CaseDetailAuctionLot[] {
  return (env.data ?? []).map((lot) => ({
    lotNo: String(lot.id),
    category: lot.category?.name?.trim() ?? "",
    name: lot.name?.trim() ?? "",
    price: lot.price != null ? `${lot.price} ₾` : "",
    winDate: formatDocDate(lot.winDate),
    url: lot.url?.trim() ?? "",
    stages: (lot.auctions ?? []).map((a) => ({
      type: a.auctionType?.trim() ?? "",
      startDate: formatDateTime(a.startDate),
      endDate: formatDateTime(a.endDate),
      eaucUrl: a.eaucUrl?.trim() ?? "",
    })),
  }));
}

/** Map the properties/get-all response into MIA "found property" rows. */
export function mapMiaProperties(
  env: EpsMiaPropertiesEnvelope,
): CaseDetailSearchPropertyRow[] {
  return (env.data ?? []).map((p) => {
    // Column header is "სახელი გვარი, პირადი N, ობიექტი": show the person's
    // identity (the backend pre-formats name + personal N in `person.name`) as
    // the primary line, with the object — plate, type, model — beneath it.
    const owner = p.person?.name?.trim() ?? "";
    const object = [p.govNumber?.trim(), p.propertyType?.name?.trim(), p.model?.trim()]
      .filter(Boolean)
      .join(", ");
    return {
      nameObject: owner || object,
      plateOrExtra: owner ? object : "",
      address: p.address?.trim() ?? "",
      orderRef: p.reqCode?.trim() ?? "",
      orderAction: p.propertySt?.name?.trim() ?? "",
      initiator: p.reqCreatedBy?.name?.trim() ?? "",
      initiatorWhen: formatDateTime(p.reqCreatedDate),
    };
  });
}

/** Map the ssa-requests/by-app-id response into SSA (სოც. სააგენტო) rows. */
export function mapSsaRequests(
  env: EpsSsaRequestsEnvelope,
): CaseDetailSocialRow[] {
  return (env.data ?? []).map((r) => {
    const p = r.person;
    // Identity fields come flat on the row; fall back to a nested `person`
    // object (and its pre-formatted `name`, covering legal entities) when the
    // service nests them instead.
    const firstName = r.firstName ?? p?.firstName ?? "";
    const lastName = r.lastName ?? p?.lastName ?? "";
    const name =
      `${firstName} ${lastName}`.trim() || (p?.name?.trim() ?? "");
    const id = (r.idnumber ?? p?.idnumber)?.trim() ?? "";
    const addressPhone = [r.address?.trim(), r.phone?.trim()]
      .filter(Boolean)
      .join(", ");
    return {
      name,
      personalId: id,
      addressPhone,
      sent: r.sent === true,
      receivedAt: formatDateTime(r.lastCheckDate),
      active: r.active === true,
      vulnerable: r.underPoverty === true || r.underProverty === true,
    };
  });
}

/**
 * Map the agency "დამატებითი ინფორმაცია" payload into label/value rows. The
 * service is optional and may return nothing; blank rows are dropped so the
 * modal can fall back to its empty state.
 */
export function mapCaseExtraInfo(
  env: EpsCaseExtraInfoEnvelope,
): CaseDetailExtraInfoRow[] {
  return (env.data ?? [])
    .map((r) => ({
      label: (r.label ?? r.key ?? r.name ?? "").trim(),
      value: (r.value ?? "").trim(),
    }))
    .filter((row) => row.label.length > 0 || row.value.length > 0);
}

/** Map landreg/infos (my.gov.ge requests) into NAPR registry request rows. */
export function mapLandregInfos(
  env: EpsLandregInfosEnvelope,
): CaseDetailRegistryInfoRow[] {
  return (env.data ?? []).map((r) => ({
    person: r.person?.name?.trim() ?? "",
    sent: r.sent === 1,
    sentDate: formatDateTime(r.sendDate),
    found: (r.answer ?? 0) !== 0,
  }));
}

/** Map landreg/real-estates into NAPR registry real-estate rows. */
export function mapLandregRealEstates(
  env: EpsLandregRealEstatesEnvelope,
): CaseDetailRegistryEstateRow[] {
  return (env.data ?? []).map((r) => ({
    cadCode: r.cadCode?.trim() ?? "",
    address: r.address?.trim() ?? "",
    // The owner (მესაკუთრე) can be a person or a legal entity; the backend
    // sends the already-formatted identity in `person.name`.
    ownerName: r.person?.name?.trim() ?? "",
    status: r.status?.name?.trim() ?? "",
  }));
}

/** Map enreg/infos into business (სამეწარმეო რეესტრი) notification rows. */
export function mapEnregInfos(
  env: EpsEnregInfosEnvelope,
): CaseDetailBusinessNotifyRow[] {
  return (env.data ?? []).map((r) => ({
    debtor: r.person?.name?.trim() ?? "",
    initiator: r.createdBy?.name?.trim() ?? "",
    createdAt: formatDateTime(r.sendDate),
    sent: r.sent === 1,
    response: r.answer != null ? String(r.answer) : "",
    soleProp: r.soleTrader === true,
  }));
}

/** Map enreg/active-shares into business (სამეწარმეო რეესტრი) share rows. */
export function mapEnregActiveShares(
  env: EpsEnregActiveSharesEnvelope,
): CaseDetailBusinessShareRow[] {
  return (env.data ?? []).map((r) => ({
    owner: r.person?.name?.trim() ?? "",
    title: r.name?.trim() ?? "",
    orgNo: r.idnumber?.trim() ?? "",
    regDate: formatDocDate(r.govRegDate),
    share: r.activeShare != null ? `${r.activeShare}%` : "",
    status: r.status?.name?.trim() ?? "",
  }));
}

/** Debtor identity line for an installment header, e.g. "შპს ბესო (448391801) - 1520574250". */
function installmentParty(inst: EpsInstallment): string {
  const d = (inst.debtors ?? [])[0];
  if (!d) return "";
  const name =
    d.organization?.trim() ||
    `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim();
  const id = (d.idnubmer ?? d.idnumber ?? "").trim();
  const pay = d.payCode?.trim() ?? "";
  const tail = [id ? `(${id})` : "", pay].filter(Boolean).join(" - ");
  return [name, tail].filter(Boolean).join(" ");
}

/** Installment header/meta (payments are fetched separately, per installment). */
export function mapInstallmentMeta(
  inst: EpsInstallment,
): Omit<CaseDetailInstallment, "payments"> {
  const valuta = inst.valutaName?.trim() ?? "";
  const amount =
    inst.amount != null ? `${inst.amount}${valuta ? ` ${valuta}` : ""}` : "";
  const start = formatDocDate(inst.startDate);
  const end = formatDocDate(inst.endDate);
  const range = start || end ? ` (${start} – ${end})` : "";
  return {
    installmentId: inst.id,
    headerLine: `${amount}${range}`.trim(),
    partyLine: installmentParty(inst),
    status: inst.status?.trim() ?? "",
  };
}

/** Map an installment's payment rows (valuta comes from the parent installment). */
export function mapInstallmentPayments(
  env: EpsInstallmentPaymentsEnvelope,
  valuta: string,
): CaseDetailInstallmentPayment[] {
  const suffix = valuta ? ` ${valuta}` : "";
  const money = (n: number | null) => (n != null ? `${n}${suffix}` : "");
  return (env.data ?? []).map((e) => ({
    paymentDate: formatDocDate(e.paymentDate),
    amountToPay: money(e.amountToPay),
    amountPayed: money(e.amountPayed),
    remainedAmount: money(e.remainedAmount),
    status: e.status?.trim() ?? "",
    confirmedBy: e.confirmedBy?.name?.trim() ?? "",
    confirmDate: formatDateTime(e.confirmDate),
  }));
}

/** Round to 2 decimals, dropping float-subtraction noise (e.g. 0.1 - 0.3). */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** "1500 GEL" / "1500" — append the currency when present. */
function formatMoney(n: number | null, valuta: string): string {
  if (n == null) return "";
  const value = round2(n);
  return valuta ? `${value} ${valuta}` : String(value);
}

/** Identity line for a money-tab party, e.g. "შპს ბესო (448391801) - 1520574250". */
function moneyPersonLine(p: EpsMoneyPerson): string {
  const name =
    p.organization?.trim() ||
    `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim();
  const id = p.idnumber?.trim();
  const pay = p.payCode?.trim();
  const tail = [id ? `(${id})` : "", pay].filter(Boolean).join(" - ");
  return [name, tail].filter(Boolean).join(" ");
}

/** `data` arrives as a single-element array; tolerate the bare-object form too. */
function firstMoneyItem(env: EpsMoneyEnvelope): EpsMoneyDataItem | null {
  const data = env.data;
  if (!data) return null;
  return Array.isArray(data) ? (data[0] ?? null) : data;
}

// Money rows live under endpoint-specific keys: debtor → `monies`,
// creditor → `credDemand` (+ `credDebt`). Collect every known group, then fall
// back to any array of objects carrying an `amount` field.
const MONEY_ROW_KEYS = ["monies", "credDemand", "credDebt", "money"];

function collectMoneyRows(item: EpsMoneyDataItem): EpsMoneyRow[] {
  const rows: EpsMoneyRow[] = [];
  for (const key of MONEY_ROW_KEYS) {
    const value = item[key];
    if (Array.isArray(value)) rows.push(...(value as EpsMoneyRow[]));
  }
  if (rows.length > 0) return rows;
  for (const [key, value] of Object.entries(item)) {
    if (key === "persons") continue;
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0] !== null &&
      "amount" in (value[0] as object)
    ) {
      rows.push(...(value as EpsMoneyRow[]));
    }
  }
  return rows;
}

/**
 * Map one reg-money envelope into funds-party info. `partyType` selects which
 * persons to show (1 = creditor, 2 = debtor); totals are summed from the rows
 * so they always match the displayed lines.
 */
export function mapMoneyParty(
  env: EpsMoneyEnvelope,
  partyType: 1 | 2,
): CaseDetailFundsPartyInfo | null {
  const item = firstMoneyItem(env);
  if (!item) return null;

  const rows = collectMoneyRows(item);
  const persons = (item.persons ?? []).filter(
    (p) => p.appPersonType === partyType,
  );
  if (rows.length === 0 && persons.length === 0) return null;

  const fallbackValuta = rows[0]?.valutaName?.trim() ?? "";
  let sumDue = 0;
  let sumPaid = 0;
  const mappedRows = rows.map((r) => {
    const valuta = r.valutaName?.trim() || fallbackValuta;
    const due = r.amount ?? 0;
    const paid = r.transfer ?? 0;
    sumDue += due;
    sumPaid += paid;
    return {
      name: r.name?.trim() ?? "",
      due: formatMoney(r.amount, valuta),
      paid: formatMoney(r.transfer, valuta),
      debt: formatMoney(due - paid, valuta),
    };
  });

  return {
    partyLines: persons.map(moneyPersonLine).filter(Boolean),
    totalDue: formatMoney(sumDue, fallbackValuta),
    totalPaid: formatMoney(sumPaid, fallbackValuta),
    totalDebt: formatMoney(sumDue - sumPaid, fallbackValuta),
    rows: mappedRows,
  };
}

/** Map the status-files response into downloadable file rows. */
export function mapStatusFiles(
  envelope: EpsStatusFilesEnvelope,
): CaseDetailProceedingFile[] {
  return (envelope.data ?? [])
    .filter((entry) => entry.file != null)
    .map((entry) => {
      const file = entry.file!;
      const fileName = file.fileName?.trim() ?? "";
      return {
        fileId: file.id,
        title: file.fileDesc?.trim() || fileName,
        fileName,
        mimeType: file.mimeType?.trim() ?? "",
        uploadedBy: entry.uploadedBy?.name?.trim() ?? "",
        createdDate: formatDateTime(entry.createdDate),
      };
    });
}

export function mapCaseDetail(
  appEnvelope: EpsAppDetailEnvelope,
  personsEnvelope: EpsPersonsEnvelope,
  demandsEnvelope: EpsDemandsEnvelope,
  statusesEnvelope: EpsStatusesEnvelope,
): CaseDetailApplication {
  const app = appEnvelope.data;
  const persons = personsEnvelope.data ?? [];
  const demands = demandsEnvelope.data ?? [];

  const claimsSummary = demands
    .map((d) => d.note?.trim())
    .filter((note): note is string => Boolean(note))
    .join("\n");

  return {
    officialCaseNo: app.regnumber?.trim() ?? "",
    bureauLines: (app.agencies ?? []).map((a) => a.name),
    categoryRight: categoryLabel(app),
    categoryPrefix: app.trType?.prefix?.trim() ?? "",
    creditors: persons.filter(isCreditor).map(mapCreditorRow),
    debtors: persons.filter(isDebtor).map(mapDebtorRow),
    writRows: mapWritRows(app),
    claimsSummary,
    claimRows: demands.map(mapClaimRow),
    proceedings: mapProceedings(statusesEnvelope),
  };
}
