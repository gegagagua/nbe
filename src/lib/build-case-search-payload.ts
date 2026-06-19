import type { CaseSearchFilters } from '@/types/case-management';
import type { EpsAppsSearchRequest } from '@/types/case-search-api';

const DEFAULT_PAGE_SIZE = 10;

function resolveIdNumber(filters: CaseSearchFilters): string | undefined {
  return (
    filters.idnumber?.trim() ||
    filters.legalIdentificationCode?.trim() ||
    undefined
  );
}

export function buildCaseSearchPayload(
  filters: CaseSearchFilters,
  pageNumber = 0,
  pageSize = DEFAULT_PAGE_SIZE,
): EpsAppsSearchRequest {
  const person: NonNullable<EpsAppsSearchRequest['data']['person']> = {};
  const idnumber = resolveIdNumber(filters);

  if (filters.firstName?.trim()) person.firstName = filters.firstName.trim();
  if (filters.lastName?.trim()) person.lastName = filters.lastName.trim();
  if (filters.organizationName?.trim()) person.organization = filters.organizationName.trim();
  if (idnumber) person.idnumber = idnumber;
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
