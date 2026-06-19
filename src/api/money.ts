import { ApiPaths, BASE_URL } from "@/constants/api";
import { apiClient } from "@/lib/api-client";

function headers(userId: number | string) {
  return { "X-USER-ID": String(userId) };
}

/** /portal/v1/reg-money/debtor/app/{appId} — debtor money info (ინფორმაცია თანხებზე tab) */
export async function getDebtorMoney(
  appId: number | string,
  userId: number | string,
) {
  const response = await apiClient.get(
    `${BASE_URL}${ApiPaths.debtorMoney(appId)}`,
    {
      headers: headers(userId),
    },
  );
  return response.data;
}

/** /portal/v1/reg-money/creditor/app/{appId} — creditor money info (ინფორმაცია თანხებზე tab) */
export async function getCreditorMoney(
  appId: number | string,
  userId: number | string,
) {
  const response = await apiClient.get(
    `${BASE_URL}${ApiPaths.creditorMoney(appId)}`,
    {
      headers: headers(userId),
    },
  );
  return response.data;
}
