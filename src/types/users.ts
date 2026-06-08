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

import type { UserAuthority } from '@/types/user-authority';

export type UserAgencyBrief = {
  id: number;
  address?: string;
};

export type UserDetail = {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  idnumber: string | null;
  realAddress: string | null;
  legalAddress: string | null;
  active: boolean;
  enabled2Fa: boolean;
  agency: UserAgencyBrief | null;
  prntUserId: number | null;
  prntUser: unknown | null;
  pwdChngDate: string | null;
  pwdNextChngDate: string | null;
  contacts: UserContact[];
  userGroups: UserGroupFromApi[];
  roles: string[];
  permissions: string[];
  authorities: UserAuthority[];
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
  phone?: string;
  email?: string;
  prntUserId?: number;
  contacts?: UserContact[];
  userGroups?: UserGroup[];
};

export type UpdateUserEnvelope = {
  data: UpdateUserRequest;
};
