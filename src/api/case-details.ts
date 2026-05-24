import { ApiPaths, EpsApiBase } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

function headers(userId: number | string) {
  return { 'X-USER-ID': String(userId) };
}

/** /portal/v1/apps/{id} — main case fields (განცხადება tab) */
export async function getAppById(id: number | string, userId: number | string) {
  const response = await apiClient.get(`${EpsApiBase}${ApiPaths.appById(id)}`, {
    headers: headers(userId),
  });
  return response.data;
}

/** /portal/v1/app/{appId}/statuses — case statuses (წარმოება tab) */
export async function getAppStatuses(appId: number | string, userId: number | string) {
  const response = await apiClient.get(`${EpsApiBase}${ApiPaths.appStatuses(appId)}`, {
    headers: headers(userId),
  });
  return response.data;
}

/** /portal/v1/app/statuses/get-files — files for a specific status (წარმოება tab) */
export async function getStatusFiles(
  appId: number | string,
  appStatusId: number | string,
  userId: number | string,
  pageNumber = 0,
  pageSize = 10,
) {
  const response = await apiClient.post(
    `${EpsApiBase}${ApiPaths.appStatusFiles}`,
    {
      data: { appStatusId, appId },
      page: { number: pageNumber, size: pageSize },
    },
    { headers: headers(userId) },
  );
  return response.data;
}

/** /portal/v1/persons/app/{appId} — creditors / debtors on a case */
export async function getAppPersons(appId: number | string, userId: number | string) {
  const response = await apiClient.get(`${EpsApiBase}${ApiPaths.appPersons(appId)}`, {
    headers: headers(userId),
  });
  return response.data;
}

/** /portal/v1/demands/app/{appId} — demands on a case */
export async function getAppDemands(appId: number | string, userId: number | string) {
  const response = await apiClient.get(`${EpsApiBase}${ApiPaths.appDemands(appId)}`, {
    headers: headers(userId),
  });
  return response.data;
}
