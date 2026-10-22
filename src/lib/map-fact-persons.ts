import {
  FactPersonType,
  type FactPerson,
  type FactPersonResponse,
} from "@/types/facts";

const text = (value: string | null | undefined) => value?.trim() ?? "";

/** "თბილისი, აბასთუმანი, ტესტ" — region, city, street address. */
function formatAddress(
  address: NonNullable<FactPersonResponse["addresses"]>[number] | undefined,
): string {
  if (!address) return "";
  const parts = [
    text(address.region?.name),
    text(address.city?.name),
    text(address.address),
  ].filter(Boolean);
  // Drop a city that repeats the region (e.g. "თბილისი, თბილისი").
  return parts.filter((part, i) => part !== parts[i - 1]).join(", ");
}

function mapFactPerson(person: FactPersonResponse): FactPerson {
  const fullName = [text(person.firstName), text(person.lastName)]
    .filter(Boolean)
    .join(" ");

  return {
    id: person.id,
    name: fullName || text(person.organization),
    idnumber: text(person.idnumber),
    address: formatAddress(person.addresses?.[0]),
    payCode: text(person.payCode),
  };
}

/** Splits the persons of a fact statement into applicants and owners. */
export function mapFactPersons(persons: FactPersonResponse[]) {
  const ofType = (typeId: number) =>
    persons
      .filter((person) => person.appPersonType?.id === typeId)
      .map(mapFactPerson);

  return {
    applicants: ofType(FactPersonType.applicant),
    owners: ofType(FactPersonType.owner),
  };
}
