import { ApiPaths, EpsEauctionApiBase } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

/** /portal/v1/lots/by-app-id — auction lots (აუქციონი tab) */
export async function getLotsByAppId(appId: number | string, pageNumber = 0, pageSize = 10) {
  const response = await apiClient.post(`${EpsEauctionApiBase}${ApiPaths.lotsByAppId}`, {
    data: { appId },
    page: { number: pageNumber, size: pageSize },
  });
  return response.data;
}
