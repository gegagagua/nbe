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
  console.log("body", body);
  const res = await apiClient.post<CreateSessionApiEnvelope>(
    `${BASE_URL}${ApiPaths.sessions.slice(1)}`,
    {
      data: body,
    },
  );
  return res.data.data;
}

export async function logoutSession(): Promise<void> {
  await apiClient.post(`${BASE_URL}/portal/v1/sessions/logout`);
}
