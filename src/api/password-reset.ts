import { ApiPaths, UmPubApiBase } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

export async function requestPasswordReset(username: string): Promise<void> {
  await apiClient.post(`${UmPubApiBase}${ApiPaths.usersResetPassword}`, {
    data: { username: username.trim() },
  });
}
