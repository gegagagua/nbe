import { ApiPaths, BASE_URL } from "@/constants/api";
import { apiClient } from "@/lib/api-client";

export type AppPersonType = 1 | 2; // 1 = კრედიტორი, 2 = მოვალე

/** /portal/v1/info-rests/get-all — MIA info requests (მოძიება tab) */
export async function getMiaInfoRests(
  appId: number | string,
  appPersonTypeId: AppPersonType,
  pageNumber = 0,
  pageSize = 10,
) {
  const response = await apiClient.post(`${BASE_URL}${ApiPaths.miaInfoRests}`, {
    data: { appId, appPersonTypeId },
    page: { number: pageNumber, size: pageSize },
  });
  return response.data;
}

/** /portal/v1/properties/get-all — MIA properties (მოძიება tab) */
export async function getMiaProperties(
  appId: number | string,
  appPersonTypeId: AppPersonType,
  pageNumber = 0,
  pageSize = 10,
) {
  const response = await apiClient.post(
    `${BASE_URL}${ApiPaths.miaProperties}`,
    {
      data: { appId, appPersonTypeId },
      page: { number: pageNumber, size: pageSize },
    },
  );
  return response.data;
}
