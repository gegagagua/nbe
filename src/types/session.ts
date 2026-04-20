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
  firstName: string;
  lastName: string;
  active: boolean;
};

export type SessionUserProfileBrief = {
  firstName: string;
  lastName: string;
};

export type CreateSessionResponse = {
  token: string;
  tokenType: string;
  user: SessionUser;
};

export type CreateSessionApiEnvelope = {
  data: CreateSessionResponse;
};
