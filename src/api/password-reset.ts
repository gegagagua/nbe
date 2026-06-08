import { ApiPaths, BASE_URL } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

export async function requestPasswordReset(username: string): Promise<void> {
  await apiClient.post(`${BASE_URL}${ApiPaths.usersResetPassword}`, {
    data: { username: username.trim() },
  });
}
