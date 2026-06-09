import { ApiPaths } from '@/constants/api';
import { epsUserHeaders } from '@/lib/eps-user-headers';
import { mapAppDemandsResponse } from '@/lib/map-app-demands-response';
import { apiClient } from '@/lib/api-client';
import type { AppDemandSummary } from '@/types/case-demands';

export async function fetchAppDemandSummary(
  appId: number | string,
  userId: number | string,
): Promise<AppDemandSummary | null> {
  const response = await apiClient.get(ApiPaths.appDemands(appId), {
    headers: epsUserHeaders(userId),
  });

  if (__DEV__) {
    console.log('[app-demands] appId:', appId, 'response:', JSON.stringify(response.data, null, 2));
  }

  return mapAppDemandsResponse(response.data);
}
