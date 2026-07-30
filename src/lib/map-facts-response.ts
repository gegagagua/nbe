import type {
  FactApplication,
  FactApplicationParty,
  FactApplicationStatus,
  FactsPage,
} from "@/types/facts";
import { formatEnforcementDateTime } from "@/utils/format-enforcement-datetime";

// The fact-portal `apps` response is dynamic ("ყველაფერი დინამიურად მოდის"),
// so every field is read defensively against a set of candidate keys with safe
// fallbacks. Exact JSON keys still need confirmation against a live response —
// see [[project_facts_page_mock]].

type Raw = Record<string, unknown>;

function asObject(value: unknown): Raw | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Raw)
    : null;
}

function firstString(source: Raw, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

/**
 * Reads `.name`/`.label` off a nested reference object. The fact-portal response
 * nests most display values as `{ id, name, active }` (`agency`, `status`,
 * `trService`, `propertyType`), not as flat strings.
 */
function nestedName(source: Raw, keys: string[]): string | undefined {
  for (const key of keys) {
    const obj = asObject(source[key]);
    if (obj) {
      const name = firstString(obj, ["name", "label", "title"]);
      if (name) return name;
    }
  }
  return undefined;
}

function personName(raw: Raw): string {
  const organization = firstString(raw, ["organization", "orgName", "company"]);
  const first = firstString(raw, ["firstName", "name"]);
  const last = firstString(raw, ["lastName", "surname"]);
  const full = [first, last].filter(Boolean).join(" ").trim();
  return full || organization || "";
}

/** Pulls the declarant/applicant from an inline person array or object. */
function mapApplicant(root: Raw): FactApplicationParty {
  const candidates: unknown[] = [
    Array.isArray(root.applicants) ? root.applicants[0] : undefined,
    root.applicant,
    root.declarant,
    Array.isArray(root.persons) ? root.persons[0] : undefined,
    Array.isArray(root.personList) ? root.personList[0] : undefined,
    Array.isArray(root.creditors) ? root.creditors[0] : undefined,
  ];
  for (const candidate of candidates) {
    const obj = asObject(candidate);
    if (!obj) continue;
    const name = personName(obj);
    const idnumber = firstString(obj, ["idnumber", "idNumber", "personalNo"]);
    if (name || idnumber) return { name, idnumber: idnumber ?? "" };
  }
  return { name: "", idnumber: "" };
}

function mapStatus(root: Raw, registeredAt: string): FactApplicationStatus | undefined {
  const statusObj = asObject(root.status);
  const label =
    firstString(root, ["statusName", "phase"]) ??
    (statusObj ? firstString(statusObj, ["name", "label"]) : undefined);
  if (!label) return undefined;

  return {
    label,
    date:
      firstString(root, ["statusDate"]) &&
      formatEnforcementDateTime(firstString(root, ["statusDate"]))
        ? formatEnforcementDateTime(firstString(root, ["statusDate"]))
        : registeredAt,
    // `trService`/`propertyType` arrive as nested `{ id, name }` objects.
    fee:
      nestedName(root, ["trService"]) ??
      firstString(root, ["fee", "feeType", "workTime", "tariff"]) ??
      "",
    ownershipType:
      nestedName(root, ["propertyType", "ownershipType"]) ??
      firstString(root, ["ownership"]) ??
      "",
  };
}

export function mapFactApplication(raw: unknown): FactApplication | null {
  const root = asObject(raw);
  if (!root) return null;

  const idRaw = root.id ?? root.appId;
  const id = typeof idRaw === "number" ? idRaw : Number(idRaw);
  if (!Number.isFinite(id)) return null;

  const registeredAt = formatEnforcementDateTime(
    firstString(root, ["finalRegistrationAt", "regDate", "inputDate", "createdDate"]),
  );

  return {
    id,
    referenceNumber: firstString(root, ["regnumber", "regNumber", "factNumber"]),
    bureauName:
      nestedName(root, ["agency"]) ??
      firstString(root, ["enforcementBureauName", "bureauName", "bureau", "organ"]) ??
      "",
    caseNumber: firstString(root, ["caseNumber", "docNo"]) ?? String(id),
    registeredAt,
    status: mapStatus(root, registeredAt),
    executor:
      firstString(root, ["executorName", "executor", "executorFullName"]) ??
      (asObject(root.ownerUser) ? personName(asObject(root.ownerUser)!) : undefined),
    applicant: mapApplicant(root),
  };
}

function extractList(root: Raw): unknown[] {
  if (Array.isArray(root.data)) return root.data;
  const dataObj = asObject(root.data);
  if (dataObj && Array.isArray(dataObj.content)) return dataObj.content;
  if (Array.isArray(root.content)) return root.content;
  return [];
}

function extractPage(root: Raw): { totalPages: number; totalRecords: number } {
  const dataObj = asObject(root.data);
  const page = asObject(root.page) ?? (dataObj ? asObject(dataObj.page) : null);
  const totalPages = page ? Number(page.totalPages) : NaN;
  const totalRecords = page ? Number(page.totalRecords) : NaN;
  return {
    totalPages: Number.isFinite(totalPages) ? totalPages : 0,
    totalRecords: Number.isFinite(totalRecords) ? totalRecords : 0,
  };
}

export function mapFactsResponse(raw: unknown): FactsPage {
  const root = asObject(raw);
  if (!root) return { data: [], totalPages: 0, totalRecords: 0 };

  const data = extractList(root)
    .map(mapFactApplication)
    .filter((item): item is FactApplication => item !== null);
  const { totalPages, totalRecords } = extractPage(root);

  return {
    data,
    totalPages: Math.max(totalPages, data.length > 0 ? 1 : 0),
    totalRecords: totalRecords || data.length,
  };
}
