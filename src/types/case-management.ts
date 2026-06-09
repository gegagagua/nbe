export type CaseSearchFilters = {
  orgTypeId?: string;
  organization?: string;
  /** იურიდიული პირის საიდენტიფიკაციო კოდი — ბექის მხარეს იგივე ველში გაერთიანება `idnumber`-თან ძებნისას. */
  legalIdentificationCode?: string;
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
  /** ქვითრის ნომერი → API `docNo` */
  docNo?: string;
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
  /** საბოლოო რეგისტრაციის თარიღი/დრო (ISO) — სიის ბარათზე ჩვენება წამების სიზუსტით. */
  finalRegistrationAt?: string | null;
  statusDate: string;
  status: CaseStatus;
  trType: CaseTrType;
  creditors: CaseParty[];
  debtors: CaseParty[];
  /** თანხის დაკისრების კატეგორიის სახელი (My.gov.ge). */
  debtCategoryName?: string | null;
  /** დავალიანების ოდენობა ტექსტურად (მაგ. ვალუტით). */
  debtAmountDisplay?: string | null;
  /** სიის ბარათი — რიგის მარკერი (მაგ. 04/1). */
  listSequenceLabel?: string | null;
  /** სააღსრულებო ბიურო / ორგანო. */
  enforcementBureauName?: string | null;
  /** ქვედა ზოლი — სტატუსი და თარიღი ერთ სტრიქონში. */
  footerStatusLine?: string | null;
  /** ქვედა ზოლი — აღმასრულებელი / ადმინ. */
  executorLine?: string | null;
  /** მარცხენა აქცენტის ხაზის ფერი (მაგ. ნარინჯისფერი). */
  cardAccentColor?: string | null;
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
  /** ცარიელი სია ძებნის გარეშე — „წარმოება არ მიმდინარეობს“. */
  emptyNoProceedings?: boolean;
};

export type CaseFiltersProps = {
  values: CaseSearchFilters;
  onChange: (next: CaseSearchFilters) => void;
  onSearch: () => void;
  onClear: () => void;
};
