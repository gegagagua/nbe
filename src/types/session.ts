export type CreateSessionRequest = {
  username: string;
  password: string;
};

export type CreateSessionPayload = {
  data: CreateSessionRequest;
};

export type SessionUser = {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  idnumber?: string;
  active: boolean;
  /** Last password change date. */
  pwdChngDate?: string | null;
};

export type SessionUserProfileBrief = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  /** Previous session info delivered with the most recent login response. */
  lastSession?: LastSessionInfo | null;
  /** Last password change date delivered with the most recent login response. */
  pwdChngDate?: string | null;
};

export type LastSessionInfo = {
  id: number;
  createdDate: string;
  ipAddress: string | null;
};

export type CreateSessionResponse = {
  token: string;
  tokenType: 'SESSION' | 'PWD_CHNG' | 'OTP';
  user: SessionUser | null;
  lastSession?: LastSessionInfo | null;
};

export type CreateSessionApiEnvelope = {
  data: CreateSessionResponse;
};
