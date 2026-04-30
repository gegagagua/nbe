import { ApiConfig } from '@/constants/api';
import { apiClient } from '@/lib/api-client';
import type {
  CaseSearchFilters,
  CaseSearchRequest,
  SearchCasesResponse,
} from '@/types/case-management';

const CASE_PAGE_SIZE = 5;

function buildSearchData(filters: CaseSearchFilters) {
  return {
    archived: false,
    ...(filters.orgTypeId?.trim() ? { orgTypeId: filters.orgTypeId.trim() } : {}),
    ...(filters.organization?.trim() ? { organization: filters.organization.trim() } : {}),
    ...(filters.appRegNo?.trim() ? { appRegNo: filters.appRegNo.trim() } : {}),
    ...(filters.trTypeId?.trim() ? { trTypeId: filters.trTypeId.trim() } : {}),
    ...(filters.transferStatusId?.trim()
      ? { transferStatusId: filters.transferStatusId.trim() }
      : {}),
    ...(filters.sourceType ? { sourceType: filters.sourceType } : {}),
    ...(filters.regDateFrom?.trim() ? { regDateFrom: filters.regDateFrom.trim() } : {}),
    ...(filters.regDateTo?.trim() ? { regDateTo: filters.regDateTo.trim() } : {}),
    ...(filters.statusDateFrom?.trim()
      ? { statusDateFrom: filters.statusDateFrom.trim() }
      : {}),
    ...(filters.statusDateTo?.trim() ? { statusDateTo: filters.statusDateTo.trim() } : {}),
    ...(filters.participantTypeId?.trim()
      ? { participantTypeId: filters.participantTypeId.trim() }
      : {}),
    ...(filters.idnumber?.trim() || filters.legalIdentificationCode?.trim()
      ? {
          idnumber:
            filters.idnumber?.trim() || filters.legalIdentificationCode?.trim() || '',
        }
      : {}),
    ...(filters.firstName?.trim() ? { firstName: filters.firstName.trim() } : {}),
    ...(filters.lastName?.trim() ? { lastName: filters.lastName.trim() } : {}),
    ...(filters.address?.trim() ? { address: filters.address.trim() } : {}),
    ...(filters.organizationName?.trim()
      ? { organizationName: filters.organizationName.trim() }
      : {}),
    ...(filters.paymentIdentifier?.trim()
      ? { paymentIdentifier: filters.paymentIdentifier.trim() }
      : {}),
    ...(filters.cadastralCode?.trim() ? { cadastralCode: filters.cadastralCode.trim() } : {}),
    ...(filters.vehicleNumber?.trim() ? { vehicleNumber: filters.vehicleNumber.trim() } : {}),
    ...(filters.postNumber?.trim() ? { postNumber: filters.postNumber.trim() } : {}),
    ...(filters.automaticProcess !== undefined
      ? { automaticProcess: filters.automaticProcess }
      : {}),
    ...(filters.updateByDate !== undefined ? { updateByDate: filters.updateByDate } : {}),
    ...(filters.conditional !== undefined ? { conditional: filters.conditional } : {}),
    ...(filters.immediateEnf !== undefined ? { immediateEnf: filters.immediateEnf } : {}),
  };
}

export async function searchCases(
  filters: CaseSearchFilters,
  pageNumber = 0,
): Promise<SearchCasesResponse> {
  const payload: CaseSearchRequest = {
    data: buildSearchData(filters),
    page: { number: pageNumber, size: CASE_PAGE_SIZE },
  };

  const response = await apiClient.post<SearchCasesResponse>(ApiConfig.epsAppsSearchPath, payload);
  return response.data;
}
