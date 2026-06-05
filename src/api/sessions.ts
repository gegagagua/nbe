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

export async function logoutSession(): Promise<void> {
  await apiClient.post(`${BASE_URL}/um-portal/v1/sessions/logout`);
}
