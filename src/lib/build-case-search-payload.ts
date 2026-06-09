import type { CaseSearchFilters } from '@/types/case-management';
import type { EpsAppsSearchRequest } from '@/types/case-search-api';

const DEFAULT_PAGE_SIZE = 10;

function collectIdNumbers(filters: CaseSearchFilters): string[] {
  const ids: string[] = [];
  const personal = filters.idnumber?.trim();
  const legal = filters.legalIdentificationCode?.trim();
  if (personal) ids.push(personal);
  if (legal) ids.push(legal);
  return ids;
}

export function buildCaseSearchPayload(
  filters: CaseSearchFilters,
  pageNumber = 0,
  pageSize = DEFAULT_PAGE_SIZE,
): EpsAppsSearchRequest {
  const person: NonNullable<EpsAppsSearchRequest['data']['person']> = {};
  const idnumbers = collectIdNumbers(filters);

  if (filters.firstName?.trim()) person.firstName = filters.firstName.trim();
  if (filters.lastName?.trim()) person.lastName = filters.lastName.trim();
  if (filters.organizationName?.trim()) person.organization = filters.organizationName.trim();
  if (idnumbers.length) person.idnumber = idnumbers;
  if (filters.paymentIdentifier?.trim()) person.payCode = filters.paymentIdentifier.trim();

  const data: EpsAppsSearchRequest['data'] = {};
  if (filters.appRegNo?.trim()) data.regnumber = filters.appRegNo.trim();
  if (filters.docNo?.trim()) data.docNo = filters.docNo.trim();
  if (Object.keys(person).length) data.person = person;

  return {
    data,
    page: { number: pageNumber, size: pageSize },
    sort: [{ property: 'inputDate', direction: 'DESC' }],
  };
}
