import {
  FactPersonType,
  type FactPerson,
  type FactPersonResponse,
} from "@/types/facts";

const text = (value: string | null | undefined) => value?.trim() ?? "";

type FactAddress = NonNullable<FactPersonResponse["addresses"]>[number];

/** "თბილისი, აბასთუმანი, ტესტ" — region, city, street address. */
function formatAddress(address: FactAddress | undefined): string {
  if (!address) return "";
  const parts = [
    text(address.region?.name),
    text(address.city?.name),
    text(address.address),
  ].filter(Boolean);
  // Drop a city that repeats the region (e.g. "თბილისი, თბილისი").
  return parts.filter((part, i) => part !== parts[i - 1]).join(", ");
}

/** First address whose `type` token matches; "" when none match. */
function pickAddress(
  addresses: FactAddress[],
  matches: (type: string) => boolean,
): string {
  const found = addresses.find((a) => matches((a.type ?? "").toUpperCase()));
  return found ? formatAddress(found) : "";
}

function mapFactPerson(person: FactPersonResponse): FactPerson {
  const fullName = [text(person.firstName), text(person.lastName)]
    .filter(Boolean)
    .join(" ");

  // The backend returns an ARRAY of addresses discriminated by `type`. Split
  // the factual (ფაქტობრივი) and legal (იურიდიული) addresses by that token;
  // when the tokens are unknown/absent, fall back to positional order so a
  // single-address row still surfaces something instead of a blank field.
  const addrs = person.addresses ?? [];
  const factualByType = pickAddress(
    addrs,
    (type) => type.includes("FACT") || type.includes("REAL") || type.includes("ACTUAL"),
  );
  const legalByType = pickAddress(
    addrs,
    (type) => type.includes("LEGAL") || type.includes("JURID"),
  );
  const factualAddress = factualByType || formatAddress(addrs[0]);
  const legalAddress =
    legalByType || (addrs.length > 1 ? formatAddress(addrs[1]) : "");

  return {
    id: person.id,
    name: fullName || text(person.organization),
    idnumber: text(person.idnumber),
    factualAddress,
    legalAddress,
    // Backward-compatible single address (used by the owner section).
    address: factualAddress || legalAddress,
    payCode: text(person.payCode),
  };
}

const personTypeId = (person: FactPersonResponse): number | null =>
  person.appPersonType?.id ?? person.personType?.id ?? null;

/**
 * Splits the persons of a fact statement into applicants and owners.
 *
 * Applicants reliably carry `appPersonType.id === 1` in both recorded and
 * registered statements. Owners, however, come back with a different (or
 * null) type on a recorded-but-unregistered statement — the final "owner"
 * classification is only stamped at registration. So anything that is NOT an
 * applicant is treated as an owner; this recovers the owner data that the old
 * strict `=== 3` filter dropped. (Fact statements only ever have these two
 * party roles.)
 */
export function mapFactPersons(persons: FactPersonResponse[]) {
  const applicants = persons
    .filter((p) => personTypeId(p) === FactPersonType.applicant)
    .map(mapFactPerson);
  const owners = persons
    .filter((p) => personTypeId(p) !== FactPersonType.applicant)
    .map(mapFactPerson);

  return { applicants, owners };
}
