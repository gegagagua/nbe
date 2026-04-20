export type CaseSearchFilters = {
  orgTypeId?: string;
  organization?: string;
  appRegNo?: string;
  trTypeId?: string;
  transferStatusId?: string;
  sourceType?: 'MANUAL' | 'ELECTRONIC' | '';
  regDateFrom?: string;
  regDateTo?: string;
  statusDateFrom?: string;
  statusDateTo?: string;
  participantTypeId?: string;
  idnumber?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  organizationName?: string;
  paymentIdentifier?: string;
  cadastralCode?: string;
  vehicleNumber?: string;
  postNumber?: string;
  automaticProcess?: boolean;
  updateByDate?: boolean;
  conditional?: boolean;
  immediateEnf?: boolean;
};

export type CaseSearchRequest = {
  data: {
    archived: boolean;
  } & Partial<CaseSearchFilters>;
  page: {
    number: number;
    size: number;
  };
};

export type CaseParty = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  organization: string | null;
  idnumber: string | null;
};

export type CaseStatus = {
  id: number;
  name: string;
  colorCode: string;
};

export type CaseTrType = {
  id: number;
  prefix: string;
  name: string;
};

export type CaseApplication = {
  id: number;
  inputDate: string;
  regnumber: string | null;
  regDate: string | null;
  statusDate: string;
  status: CaseStatus;
  trType: CaseTrType;
  creditors: CaseParty[];
  debtors: CaseParty[];
};

export type CasePage = {
  totalRecords: number;
  totalPages: number;
  size: number;
  number: number;
};

export type SearchCasesResponse = {
  data: CaseApplication[];
  page: CasePage;
};

export type CaseListProps = {
  items: CaseApplication[];
  loading: boolean;
  empty: boolean;
};

export type CaseFiltersProps = {
  values: CaseSearchFilters;
  onChange: (next: CaseSearchFilters) => void;
  onSearch: () => void;
  onClear: () => void;
};
