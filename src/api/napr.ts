import { ApiPaths, EpsNaprApiBase } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

/** /portal/v1/landreg/infos/by-app-id — land registry info (მოძიება tab) */
export async function getLandregInfos(appId: number | string) {
  const response = await apiClient.post(`${EpsNaprApiBase}${ApiPaths.landregInfos}`, {
    data: { appId },
  });
  return response.data;
}

/** /portal/v1/landreg/real-estates/by-app-id — real estates (მოძიება tab) */
export async function getLandregRealEstates(
  appId: number | string,
  pageNumber = 0,
  pageSize = 10,
) {
  const response = await apiClient.post(`${EpsNaprApiBase}${ApiPaths.landregRealEstates}`, {
    data: { appId },
    page: { number: pageNumber, size: pageSize },
  });
  return response.data;
}

/** /portal/v1/enreg/infos/by-app-id — enterprise registry info (მოძიება tab) */
export async function getEnregInfos(appId: number | string, pageNumber = 0, pageSize = 10) {
  const response = await apiClient.post(`${EpsNaprApiBase}${ApiPaths.enregInfos}`, {
    data: { appId },
    page: { number: pageNumber, size: pageSize },
  });
  return response.data;
}

/** /portal/v1/enreg/active-shares/by-app-id — active shares (მოძიება tab) */
export async function getEnregActiveShares(
  appId: number | string,
  pageNumber = 0,
  pageSize = 10,
) {
  const response = await apiClient.post(`${EpsNaprApiBase}${ApiPaths.enregActiveShares}`, {
    data: { appId },
    page: { number: pageNumber, size: pageSize },
  });
  return response.data;
}
