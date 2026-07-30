import { ApiPaths } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import { mapFactsResponse } from "@/lib/map-facts-response";
import type {
  FactsPage,
  FactsSearchFilters,
  FactsSearchPerson,
  FactsSearchRequest,
} from "@/types/facts";

const DEFAULT_PAGE_SIZE = 10;

function buildFactsSearchPayload(
  filters: FactsSearchFilters,
  pageNumber: number,
  pageSize: number,
): FactsSearchRequest {
  const person: FactsSearchPerson = {};
  if (filters.idnumber?.trim()) person.idnumber = filters.idnumber.trim();
  if (filters.firstName?.trim()) person.firstName = filters.firstName.trim();
  if (filters.lastName?.trim()) person.lastName = filters.lastName.trim();
  if (filters.address?.trim()) person.address = filters.address.trim();
  if (filters.organization?.trim())
    person.organization = filters.organization.trim();
  if (filters.payCode?.trim()) person.payCode = filters.payCode.trim();

  const data: FactsSearchRequest["data"] = {};
  if (filters.regnumber?.trim()) data.regnumber = filters.regnumber.trim();
  if (filters.regDateFrom?.trim()) data.regDateFrom = filters.regDateFrom.trim();
  if (filters.regDateTo?.trim()) data.regDateTo = filters.regDateTo.trim();
  if (Object.keys(person).length) data.person = person;

  return {
    data,
    page: { number: pageNumber, size: pageSize },
    sort: [{ property: "regDate", direction: "DESC" }],
  };
}

/** POST /fact-portal/v1/apps/search — ფაქტების კონსტატაცია list. Bearer only. */
export async function searchFacts(
  filters: FactsSearchFilters = {},
  pageNumber = 0,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<FactsPage> {
  const payload = buildFactsSearchPayload(filters, pageNumber, pageSize);
  const response = await apiClient.post(ApiPaths.factAppsSearch, payload);
  return mapFactsResponse(response.data);
}

/** GET /fact-portal/v1/apps/{id} — single fact statement (dynamic response). */
export async function getFactById(id: number | string) {
  const response = await apiClient.get(ApiPaths.factAppById(id));
  return response.data;
}

/** GET /fact-portal/v1/persons/app/{appId} — persons linked to a fact statement. */
export async function getFactPersons(appId: number | string) {
  const response = await apiClient.get(ApiPaths.factAppPersons(appId));
  return response.data;
}
