import { ApiPaths } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import { buildCaseSearchPayload } from "@/lib/build-case-search-payload";
import { epsUserHeaders } from "@/lib/eps-user-headers";
import { mapSearchCasesResponse } from "@/lib/map-search-cases-response";
import type {
  CaseSearchFilters,
  SearchCasesResponse,
} from "@/types/case-management";

export async function searchCases(
  userId: number,
  filters: CaseSearchFilters = {},
  pageNumber = 0,
): Promise<SearchCasesResponse> {
  const payload = buildCaseSearchPayload(filters, pageNumber);

  const response = await apiClient.post(ApiPaths.appsSearch, payload, {
    headers: epsUserHeaders(userId),
  });
  console.log("response:", response.data[0]);
  return mapSearchCasesResponse(response.data);
}
