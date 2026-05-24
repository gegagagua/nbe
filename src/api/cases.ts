import { ApiPaths, EpsApiBase } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

export type CaseSearchSort = {
  property: string;
  direction: 'ASC' | 'DESC';
};

export type CaseSearchFilters = {
  regnumber?: string;
  docNo?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  idnumber?: string[];
  payCode?: string;
};

export type CaseSearchRequest = {
  data: {
    regnumber?: string;
    docNo?: string;
    person?: {
      firstName?: string;
      lastName?: string;
      organization?: string;
      idnumber?: string[];
      payCode?: string;
    };
  };
  page: { number: number; size: number };
  sort?: CaseSearchSort[];
};

const CASE_PAGE_SIZE = 10;

export async function searchCases(
  filters: CaseSearchFilters = {},
  pageNumber = 0,
  sort?: CaseSearchSort[],
) {
  const person: CaseSearchRequest['data']['person'] = {};
  if (filters.firstName) person.firstName = filters.firstName.trim();
  if (filters.lastName) person.lastName = filters.lastName.trim();
  if (filters.organization) person.organization = filters.organization.trim();
  if (filters.idnumber?.length) person.idnumber = filters.idnumber;
  if (filters.payCode) person.payCode = filters.payCode.trim();

  const data: CaseSearchRequest['data'] = {};
  if (filters.regnumber) data.regnumber = filters.regnumber.trim();
  if (filters.docNo) data.docNo = filters.docNo.trim();
  if (Object.keys(person).length) data.person = person;

  const payload: CaseSearchRequest = {
    data,
    page: { number: pageNumber, size: CASE_PAGE_SIZE },
    ...(sort?.length ? { sort } : {}),
  };

  const response = await apiClient.post(
    `${EpsApiBase}${ApiPaths.appsSearch}`,
    payload,
  );
  return response.data;
}
