import { ApiPaths } from '@/constants/api';
import { apiClient } from '@/lib/api-client';
import type {
  DebtorAppSearchData,
  DebtorRegistryApplicationDetail,
  DebtorSearchFilters,
  DebtorSearchRequest,
  GetDebtorAppResponse,
  SearchDebtorAppsResponse,
} from '@/types/debtor-registry';

const DEFAULT_PAGE_SIZE = 5;

// The entered personal number filters on the requested person (`person.idnumber`),
// per the backend `AppSearchPortal` schema. An empty filter returns all records.
function buildSearchData(filters: DebtorSearchFilters): DebtorAppSearchData {
  const idnumber = filters.applicantPersonalNumber?.trim();
  if (!idnumber) {
    return {};
  }
  return { person: { idnumber } };
}

export async function searchDebtorApps(
  filters: DebtorSearchFilters,
  pageNumber = 0,
): Promise<SearchDebtorAppsResponse> {
  const payload: DebtorSearchRequest = {
    data: buildSearchData(filters),
    page: { number: pageNumber, size: DEFAULT_PAGE_SIZE },
  };

  const response = await apiClient.post<SearchDebtorAppsResponse>(
    ApiPaths.debtorAppsSearch,
    payload,
  );
  return response.data;
}

export async function getDebtorApp(
  id: number | string,
): Promise<DebtorRegistryApplicationDetail> {
  const response = await apiClient.get<GetDebtorAppResponse>(
    ApiPaths.debtorAppById(id),
  );
  console.log('[DEBTOR DETAIL]', JSON.stringify(response.data.data, null, 2));
  return response.data.data;
}
