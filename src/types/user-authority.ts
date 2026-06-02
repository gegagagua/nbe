export type UserAuthorityType = {
  active?: boolean;
  id?: number;
  name?: string;
};

export type UserAuthority = {
  active?: boolean;
  description?: string;
  id?: number;
  keyword?: string;
  name?: string;
  type?: UserAuthorityType;
};
