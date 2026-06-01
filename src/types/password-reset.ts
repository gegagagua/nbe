export type RequestPasswordResetRequest = {
  username: string;
};

export type RequestPasswordResetEnvelope = {
  data: RequestPasswordResetRequest;
};
