import { ApiPaths } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import type {
  EpsAppPaymentsResponse,
  EpsTransfersResponse,
} from "@/types/case-detail-api";

const PAYMENTS_PAGE_SIZE = 50;

/**
 * POST /payment-portal-pub/v1/payments/by-app-and-app-prsn-type — amounts
 * credited to the application for one party (appPersonTypeId: 1 = creditor,
 * 2 = debtor). Goes through the gateway with the session bearer token.
 */
export async function getCasePayments(
  appId: number | string,
  appPersonTypeId: 1 | 2,
): Promise<EpsAppPaymentsResponse> {
  const response = await apiClient.post<EpsAppPaymentsResponse>(
    ApiPaths.appPaymentsByType,
    {
      data: { appId: Number(appId), appPersonTypeId },
      page: { number: 0, size: PAYMENTS_PAGE_SIZE },
    },
  );
  return response.data;
}

/**
 * GET /transfer-portal-pub/v1/schemas/app/{appId} — transfer schemas (with
 * their current status) registered against the application.
 */
export async function getCaseTransfers(
  appId: number | string,
): Promise<EpsTransfersResponse> {
  const response = await apiClient.get<EpsTransfersResponse>(
    ApiPaths.appTransfers(appId),
  );
  return response.data;
}
