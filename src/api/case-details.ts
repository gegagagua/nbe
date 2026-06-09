import { ApiPaths } from '@/constants/api';
import { epsUserHeaders } from '@/lib/eps-user-headers';
import { apiClient } from '@/lib/api-client';

export async function getAppById(id: number | string, userId: number | string) {
  const response = await apiClient.get(ApiPaths.appById(id), {
    headers: epsUserHeaders(userId),
  });
  return response.data;
}

export async function getAppStatuses(appId: number | string, userId: number | string) {
  const response = await apiClient.get(ApiPaths.appStatuses(appId), {
    headers: epsUserHeaders(userId),
  });
  return response.data;
}

export async function getStatusFiles(
  appId: number | string,
  appStatusId: number | string,
  userId: number | string,
  pageNumber = 0,
  pageSize = 10,
) {
  const response = await apiClient.post(
    ApiPaths.appStatusFiles,
    {
      data: { appStatusId, appId },
      page: { number: pageNumber, size: pageSize },
    },
    { headers: epsUserHeaders(userId) },
  );
  return response.data;
}

export async function getAppPersons(appId: number | string, userId: number | string) {
  const response = await apiClient.get(ApiPaths.appPersons(appId), {
    headers: epsUserHeaders(userId),
  });
  return response.data;
}

export async function getAppDemands(appId: number | string, userId: number | string) {
  const response = await apiClient.get(ApiPaths.appDemands(appId), {
    headers: epsUserHeaders(userId),
  });
  return response.data;
}
