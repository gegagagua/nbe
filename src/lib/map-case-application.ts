import type { CaseApplication, CaseParty } from "@/types/case-management";
import { formatGelAmount } from "@/utils/format-gel-amount";

function mapParty(raw: unknown): CaseParty | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "number" ? r.id : 0;
  return {
    id,
    firstName: typeof r.firstName === "string" ? r.firstName : null,
    lastName: typeof r.lastName === "string" ? r.lastName : null,
    organization: typeof r.organization === "string" ? r.organization : null,
    idnumber: typeof r.idnumber === "string" ? r.idnumber : null,
  };
}

function mapParties(raw: unknown): CaseParty[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(mapParty).filter((p): p is CaseParty => p !== null);
}

export function mapCaseApplication(raw: unknown): CaseApplication | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "number" ? r.id : null;
  if (id == null) return null;

  const trTypeRaw = r.trType;
  const trTypeObj =
    trTypeRaw && typeof trTypeRaw === "object"
      ? (trTypeRaw as Record<string, unknown>)
      : null;
  const statusRaw = r.status;
  const statusObj =
    statusRaw && typeof statusRaw === "object"
      ? (statusRaw as Record<string, unknown>)
      : null;

  return {
    id,
    inputDate: String(r.inputDate ?? r.regDate ?? ""),
    regnumber: typeof r.regnumber === "string" ? r.regnumber : null,
    regDate: typeof r.regDate === "string" ? r.regDate : null,
    finalRegistrationAt:
      typeof r.finalRegistrationAt === "string"
        ? r.finalRegistrationAt
        : typeof r.regDate === "string"
          ? r.regDate
          : null,
    statusDate: String(r.statusDate ?? r.regDate ?? ""),
    status: {
      id: typeof statusObj?.id === "number" ? statusObj.id : 0,
      name: typeof statusObj?.name === "string" ? statusObj.name : "—",
      colorCode:
        typeof statusObj?.colorCode === "string"
          ? statusObj.colorCode
          : "#2b436c",
    },
    trType: {
      id: typeof trTypeObj?.id === "number" ? trTypeObj.id : 0,
      prefix: typeof trTypeObj?.prefix === "string" ? trTypeObj.prefix : "",
      name: typeof trTypeObj?.name === "string" ? trTypeObj.name : "—",
    },
    creditors: mapParties(r.creditors ?? r.creditorList),
    debtors: mapParties(r.debtors ?? r.debtorList),
    debtCategoryName:
      typeof r.debtCategoryName === "string"
        ? r.debtCategoryName
        : typeof r.debtCategory === "string"
          ? r.debtCategory
          : null,
    debtAmountDisplay:
      typeof r.remainDebt === "number" || typeof r.remainDebt === "string"
        ? formatGelAmount(r.remainDebt)
        : null,
    enforcementBureauName:
      typeof r.enforcementBureauName === "string"
        ? r.enforcementBureauName
        : typeof r.bureauName === "string"
          ? r.bureauName
          : null,
  };
}
