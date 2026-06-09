export type EpsAppsSearchPerson = {
  firstName?: string;
  lastName?: string;
  organization?: string;
  idnumber?: string[];
  payCode?: string;
};

export type EpsAppsSearchData = {
  regnumber?: string;
  docNo?: string;
  person?: EpsAppsSearchPerson;
};

export type EpsAppsSearchSort = {
  property: string;
  direction: 'ASC' | 'DESC';
};

export type EpsAppsSearchRequest = {
  data: EpsAppsSearchData;
  page: { number: number; size: number };
  sort?: EpsAppsSearchSort[];
};
