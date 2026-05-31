export type CreatePortalUserRequest = {
  idnumber: string;
  mobile: string;
  email: string;
  realAddress: string;
  legalAddress: string;
  pwd: string;
  retypePwd: string;
};

export type CreatePortalUserEnvelope = {
  data: CreatePortalUserRequest;
};

export type UpdateUserPasswordRequest = {
  crntPwd: string;
  newPwd: string;
  retypeNewPwd: string;
};

export type UpdateUserPasswordEnvelope = {
  data: UpdateUserPasswordRequest;
};

export type UserContact = {
  id?: number;
  type?: string;
  contact?: string;
};

export type UserGroup = {
  id?: number;
  groupId?: number;
  expDate?: string;
};

export type UpdateUserRequest = {
  agencyId?: number;
  username?: string;
  firstName: string;
  lastName: string;
  idnumber?: string;
  prntUserId?: number;
  contacts?: UserContact[];
  userGroups?: UserGroup[];
};

export type UpdateUserEnvelope = {
  data: UpdateUserRequest;
};
