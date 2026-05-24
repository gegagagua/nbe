import { ApiPaths, EpsSsaApiBase } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

/** /portal/v1/ssa-requests/by-app-id — SSA requests (მოძიება tab) */
export async function getSsaRequests(appId: number | string) {
  const response = await apiClient.post(`${EpsSsaApiBase}${ApiPaths.ssaRequests}`, {
    data: { appId },
  });
  return response.data;
}
