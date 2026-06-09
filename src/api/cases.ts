import { ApiPaths, BASE_URL } from '@/constants/api';
import { buildCaseSearchPayload } from '@/lib/build-case-search-payload';
import { epsUserHeaders } from '@/lib/eps-user-headers';
import { mapSearchCasesResponse } from '@/lib/map-search-cases-response';
import { apiClient } from '@/lib/api-client';
import type { CaseSearchFilters, SearchCasesResponse } from '@/types/case-management';

export async function searchCases(
  userId: number,
  filters: CaseSearchFilters = {},
  pageNumber = 0,
): Promise<SearchCasesResponse> {
  const payload = buildCaseSearchPayload(filters, pageNumber);
  const url = `${BASE_URL}${ApiPaths.appsSearch}`;

  if (__DEV__) {
    console.log('[apps-search] URL:', url);
    console.log('[apps-search] X-User-ID:', userId);
    console.log('[apps-search] request:', JSON.stringify(payload, null, 2));
  }

  const response = await apiClient.post(ApiPaths.appsSearch, payload, {
    headers: epsUserHeaders(userId),
  });

  if (__DEV__) {
    console.log('[apps-search] response:', JSON.stringify(response.data, null, 2));
  }

  return mapSearchCasesResponse(response.data);
}
