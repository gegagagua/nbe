import { ApiConfig } from '@/constants/api';
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
