import { ApiPaths } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import { epsUserHeaders } from "@/lib/eps-user-headers";
import { mapFactsResponse } from "@/lib/map-facts-response";
import type {
  FactAppCreateResponse,
  FactAppDetailResponse,
  FactAppPayload,
  FactPersonResponse,
  FactsPage,
  FactsSearchFilters,
  FactsSearchPerson,
  FactsSearchRequest,
  FactStatusFilesResponse,
  FactStatusResponse,
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

  const data: FactsSearchRequest["data"] = {};
  if (filters.regnumber?.trim()) data.regnumber = filters.regnumber.trim();
  if (filters.regDateFrom?.trim())
    data.regDateFrom = filters.regDateFrom.trim();
  if (filters.regDateTo?.trim()) data.regDateTo = filters.regDateTo.trim();
  if (filters.payCode?.trim()) data.Paycode = filters.payCode.trim();
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

/**
 * POST /fact-portal/v1/apps — ჩაწერა: record a statement on the backend. The
 * backend mints the preliminary case number (the app id) and the applicant's
 * payment identifier (payCode, F…) — nothing is generated client-side.
 * Returns the created app id.
 */
export async function createFactApp(payload: FactAppPayload): Promise<number> {
  const response = await apiClient.post<FactAppCreateResponse>(
    ApiPaths.factApps,
    payload,
  );
  const data = response.data?.data;
  const id = typeof data === "number" ? data : data?.id;
  if (id == null) {
    throw new Error("fact-portal create returned no app id");
  }
  return id;
}

/** PUT /fact-portal/v1/apps/{id} — რედაქტირება: update a recorded statement. */
export async function updateFactApp(
  id: number | string,
  payload: FactAppPayload,
): Promise<void> {
  await apiClient.put(ApiPaths.factAppById(id), payload);
}

/** GET /fact-portal/v1/apps/{id} — single fact statement (opened case). */
export async function getFactById(
  id: number | string,
): Promise<FactAppDetailResponse> {
  const response = await apiClient.get<FactAppDetailResponse>(
    ApiPaths.factAppById(id),
  );
  return response.data;
}

/** GET /fact-portal/v1/persons/app/{appId} — persons linked to a fact statement. */
export async function getFactPersons(
  appId: number | string,
): Promise<FactPersonResponse[]> {
  const response = await apiClient.get<{ data: FactPersonResponse[] | null }>(
    ApiPaths.factAppPersons(appId),
  );
  return response.data.data ?? [];
}

/**
 * GET /fact-portal/v1/app/{appId}/status — ოქმი tab proceeding status(es).
 * Needs the `X-User-ID` header (same as the EPS status/files routes); without
 * it the gateway returns 401/403 and the ოქმი tab comes back empty.
 */
export async function getFactStatus(
  appId: number | string,
  userId: number | string,
): Promise<FactStatusResponse> {
  const response = await apiClient.get<FactStatusResponse>(
    ApiPaths.factAppStatus(appId),
    { headers: epsUserHeaders(userId) },
  );
  return response.data;
}

/** POST /fact-portal/v1/status/get-files — downloadable files for one status. */
export async function getFactStatusFiles(
  appStatusId: number | string,
  appId: number | string,
  userId: number | string,
  pageNumber = 0,
  // A status carries the generated protocol cover page, the constatation
  // protocol docs AND the multimedia uploads — a small page silently drops
  // the tail of that list.
  pageSize = 50,
): Promise<FactStatusFilesResponse> {
  const response = await apiClient.post<FactStatusFilesResponse>(
    ApiPaths.factStatusGetFiles,
    {
      data: { appStatusId, appId },
      page: { number: pageNumber, size: pageSize },
    },
    { headers: epsUserHeaders(userId) },
  );
  return response.data;
}
