import { ApiPaths, BASE_URL } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

/** /ssa-portal/v1/ssa-requests/by-app-id — SSA requests (სოც. სააგენტო / მოძიება tab) */
export async function getSsaRequests(appId: number | string) {
  const response = await apiClient.post(`${BASE_URL}${ApiPaths.ssaRequests}`, {
    data: { appId },
  });
  return response.data;
}
