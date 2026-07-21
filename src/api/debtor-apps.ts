import { ApiConfig } from '@/constants/api';
import { apiClient } from '@/lib/api-client';
import type {
  DebtorSearchFilters,
  DebtorSearchRequest,
  SearchDebtorAppsResponse,
} from '@/types/debtor-registry';

const DEFAULT_PAGE_SIZE = 5;

function buildSearchData(filters: DebtorSearchFilters): Record<string, string> {
  const applicantIdnumber = filters.applicantPersonalNumber?.trim();
  if (!applicantIdnumber) {
    return {};
  }
  return { applicantIdnumber };
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
