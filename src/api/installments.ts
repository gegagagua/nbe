import { ApiPaths, EpsInstallmentApiBase } from '@/constants/api';
import { apiClient } from '@/lib/api-client';

function headers(userId: number | string) {
  return { 'X-USER-ID': String(userId) };
}

/** /portal/v1/installments/{id} — installment schedule (განწილვადება tab) */
export async function getInstallment(id: number | string, userId: number | string) {
  const response = await apiClient.get(`${EpsInstallmentApiBase}${ApiPaths.installmentById(id)}`, {
    headers: headers(userId),
  });
  return response.data;
}

/** /portal/v1/installments/payment/by-installment-id — installment payments */
export async function getInstallmentPayments(appId: number | string, installmentId: number | string) {
  const response = await apiClient.post(
    `${EpsInstallmentApiBase}${ApiPaths.installmentPayments}`,
    { data: { appId, installmentId } },
  );
  return response.data;
}
