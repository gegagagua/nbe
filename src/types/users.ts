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

export type CreatePortalUserResponse = {
  data: { userId: number };
};

export type VerifyPhoneOtpRequest = {
  userId: number;
  code: string;
};

export type VerifyPhoneOtpResponse = {
  data: {
    userId: number;
    verificationId: number;
    verificationUrl: string;
  };
};

export type CheckVerificationRequest = {
  verificationId: number;
};

export type UserAgencyBrief = {
  id: number;
  address?: string;
};

export type UserDetail = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  idnumber: string | null;
  realAddress: string | null;
  legalAddress: string | null;
  active: boolean;
  agency?: UserAgencyBrief;
  prntUserId?: number | null;
  contacts?: UserContact[];
  userGroups?: UserGroupFromApi[];
};

export type GetUserResponse = {
  data: UserDetail;
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

export type UserGroupFromApi = {
  id?: number;
  groupId?: number;
  group?: { id?: number };
  expDate?: string;
};

export type UpdateUserRequest = {
  agencyId?: number;
  username?: string;
  firstName: string;
  lastName: string;
  idnumber?: string;
  realAddress?: string;
  legalAddress?: string;
  prntUserId?: number;
  contacts?: UserContact[];
  userGroups?: UserGroup[];
};

export type UpdateUserEnvelope = {
  data: UpdateUserRequest;
};
