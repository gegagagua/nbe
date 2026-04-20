import { ApiConfig } from '@/constants/api';
import { apiClient } from '@/lib/api-client';
import type {
  DebtorSearchFilters,
  DebtorSearchRequest,
  SearchDebtorAppsResponse,
} from '@/types/debtor-registry';

const DEFAULT_PAGE_SIZE = 5;

function buildSearchData(filters: DebtorSearchFilters) {
  return {
    ...(filters.idnumber?.trim() ? { idnumber: filters.idnumber.trim() } : {}),
    ...(filters.firstName?.trim() ? { firstName: filters.firstName.trim() } : {}),
    ...(filters.lastName?.trim() ? { lastName: filters.lastName.trim() } : {}),
    ...(filters.organization?.trim()
      ? { organization: filters.organization.trim() }
      : {}),
    ...(filters.docDateFrom?.trim() ? { docDateFrom: filters.docDateFrom.trim() } : {}),
    ...(filters.docDateTo?.trim() ? { docDateTo: filters.docDateTo.trim() } : {}),
  };
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
    ApiConfig.debtorSearchPath,
    payload,
  );
  return response.data;
}
