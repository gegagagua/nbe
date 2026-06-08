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
};

export type SessionUserProfileBrief = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
};

export type CreateSessionResponse = {
  token: string;
  tokenType: 'SESSION' | 'PWD_CHNG';
  user: SessionUser | null;
};

export type CreateSessionApiEnvelope = {
  data: CreateSessionResponse;
};
