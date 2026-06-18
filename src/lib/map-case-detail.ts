import type {
  CaseDetailClaimRow,
  CaseDetailCreditorParty,
  CaseDetailCreditorRow,
  CaseDetailAuctionLot,
  CaseDetailData,
  CaseDetailDebtorRow,
  CaseDetailInstallment,
  CaseDetailInstallmentPayment,
  CaseDetailProceedingFile,
  CaseDetailProceedingStatus,
  CaseDetailWritRow,
} from "@/types/case-detail-data";
import type {
  EpsAppDetail,
  EpsAppDetailEnvelope,
  EpsDemand,
  EpsDemandsEnvelope,
  EpsInstallment,
  EpsInstallmentPaymentsEnvelope,
  EpsLotsEnvelope,
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
    creditors: persons.filter(isCreditor).map(mapCreditorRow),
    debtors: persons.filter(isDebtor).map(mapDebtorRow),
    writRows: mapWritRows(app),
    claimsSummary,
    claimRows: demands.map(mapClaimRow),
    proceedings: mapProceedings(statusesEnvelope),
  };
}
