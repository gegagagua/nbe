export type DebtorSearchFilters = {
  requestedPersonIdNumber?: string;
};

// Matches the backend `AppSearchPortal` schema. Search filters on the requested
// person (person.*) or the case registration number — there is no applicant filter.
export type DebtorAppSearchData = {
  regnumber?: string;
  person?: {
    payCode?: string;
    idnumber?: string;
    name?: string;
  };
};

export type DebtorSearchRequest = {
  data: DebtorAppSearchData;
  page: {
    number: number;
    size: number;
  };
};

export type DebtorRegistryUser = {
  id: number;
  name: string;
};

export type DebtorRegistryStatus = {
  id: number;
  name: string;
  active: boolean;
};

export type DebtorRegistryPerson = {
  idnumber: string | null;
  personName: string | null;
  address: string | null;
};

export type DebtorRegistryApplicant = {
  id: number;
  appId: number;
  name: string | null;
  idnumber: string | null;
  phone: string | null;
  address: string | null;
};

export type DebtorRegistryApplication = {
  id: number;
  createdDate: string;
  createdBy: DebtorRegistryUser;
  regnumber: string | null;
  regDate: string | null;
  status?: DebtorRegistryStatus | null;
  statusDate: string;
  statusUser: DebtorRegistryUser;
  trType?: DebtorRegistryStatus | null;
  caseNo: string | null;
  caseDate: string | null;
  caseTrackId: number | null;
  payableAmount?: number | null;
  requestedPerson?: DebtorRegistryPerson | null;
  applicants?: DebtorRegistryApplicant[];
  downloadUrl?: string | null;
};

export type DebtorRegistryPage = {
  totalRecords: number;
  totalPages: number;
  size: number;
  number: number;
};

export type SearchDebtorAppsResponse = {
  data: DebtorRegistryApplication[];
  page: DebtorRegistryPage;
};

// Matches the backend `AppResp` schema (GET /apps/{id}). Unlike the search rows
// it has no `applicants`, but carries `payableAmount` (დავალიანება).
export type DebtorRegistryApplicationDetail = {
  id: number;
  createdDate: string | null;
  createdBy?: DebtorRegistryUser | null;
  modifiedDate?: string | null;
  modifiedBy?: DebtorRegistryUser | null;
  inputDate?: string | null;
  statusDate: string | null;
  trType?: DebtorRegistryStatus | null;
  status?: DebtorRegistryStatus | null;
  caseNo: string | null;
  caseDate: string | null;
  caseAppId?: number | null;
  caseTrackId?: number | null;
  statusUser?: DebtorRegistryUser | null;
  regnumber: string | null;
  regDate: string | null;
  payableAmount?: number | null;
  requestedPerson?: DebtorRegistryPerson | null;
};

export type GetDebtorAppResponse = {
  data: DebtorRegistryApplicationDetail;
};

export type DebtorRegistryFiltersProps = {
  values: DebtorSearchFilters;
  onChange: (next: DebtorSearchFilters) => void;
  onSearch: () => void;
  onClear: () => void;
};

export type DebtorRegistryListProps = {
  items: DebtorRegistryApplication[];
  loading: boolean;
  empty: boolean;
  emptyText?: string;
};
