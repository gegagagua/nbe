import { ApiPaths, EpsEauctionApiBase } from '@/constants/api';
import { apiClient } from '@/lib/api-client';
import { epsUserHeaders } from '@/lib/eps-user-headers';

/** /portal/v1/lots/by-app-id — auction lots (აუქციონი tab) */
export async function getLotsByAppId(
  appId: number | string,
  userId: number | string,
  pageNumber = 0,
  pageSize = 10,
) {
  const response = await apiClient.post(
    `${EpsEauctionApiBase}${ApiPaths.lotsByAppId}`,
    {
      data: { appId },
      page: { number: pageNumber, size: pageSize },
    },
    { headers: epsUserHeaders(userId) },
  );
  return response.data;
}
