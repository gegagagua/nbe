import { ApiPaths, BASE_URL } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import type {
  CreateSessionApiEnvelope,
  CreateSessionRequest,
  CreateSessionResponse,
} from "@/types/session";

export async function createSession(
  body: CreateSessionRequest,
): Promise<CreateSessionResponse> {
  const res = await apiClient.post<CreateSessionApiEnvelope>(
    `${BASE_URL}${ApiPaths.sessions}`,
    {
      data: body,
    },
  );
  return res.data.data;
}

export async function verifyLoginOtp(
  otpToken: string,
  code: string,
): Promise<CreateSessionResponse> {
  const res = await apiClient.patch<CreateSessionApiEnvelope>(
    `${BASE_URL}${ApiPaths.sessionOtpVerify(code)}`,
    null,
    { headers: { Authorization: `Bearer ${otpToken}` } },
  );
  return res.data.data;
}

/**
 * Invalidate the current session server-side (PEN073 F-12). Without this call
 * the token stayed valid on the server until natural expiry, so a captured
 * token outlived the user's "logout". Callers (signOut) fire this
 * fire-and-forget, so local cleanup still proceeds even if the network fails.
 *
 * The token is passed in explicitly because signOut wipes it from storage right
 * after — relying on the request interceptor to read it would race the delete.
 */
export async function logoutSession(token?: string): Promise<void> {
  await apiClient.post(
    `${BASE_URL}${ApiPaths.logout}`,
    undefined,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  );
}
