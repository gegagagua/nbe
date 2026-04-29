export type DebtorSearchFilters = {
  idnumber?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  docDateFrom?: string;
  docDateTo?: string;
};

export type DebtorSearchRequest = {
  data: Record<string, string>;
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
  requestedPerson?: DebtorRegistryPerson | null;
  applicants?: DebtorRegistryApplicant[];
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
};
