import { ApiConfig, UmApiBase } from '@/constants/api';
import { apiClient } from '@/lib/api-client';
import type {
  CreateSessionApiEnvelope,
  CreateSessionRequest,
  CreateSessionResponse,
} from '@/types/session';

export async function createSession(body: CreateSessionRequest): Promise<CreateSessionResponse> {
  const res = await apiClient.post<CreateSessionApiEnvelope>(ApiConfig.sessionsPath, {
    data: body,
  });
  return res.data.data;
}

export async function logoutSession(): Promise<void> {
  await apiClient.post(`${UmApiBase}/portal/v1/sessions/logout`);
}
