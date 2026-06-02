import { isAxiosError } from 'axios';

import { ApiPaths, EpsApiBase } from '@/constants/api';
import { GUEST_FINE_CATEGORY_CODE, USE_GUEST_FINE_MOCK } from '@/constants/guest-fine';
import { apiClient } from '@/lib/api-client';
import { mapGuestFineCheckResult } from '@/lib/map-guest-fine-check-result';
import type { GuestFineCheckRequest, GuestFineCheckResult } from '@/types/guest-fine';

type GuestFineCheckEnvelope = { data: unknown };

async function mockCheckGuestFineDebt(
  documentNumber: string,
): Promise<GuestFineCheckResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (documentNumber.trim().length >= 3) {
    return { found: true, amount: '320.00', currency: 'GEL', paymentUrl: null };
  }
  return { found: false };
}

export async function checkGuestFineDebt(
  input: Omit<GuestFineCheckRequest, 'categoryCode'>,
): Promise<GuestFineCheckResult> {
  if (USE_GUEST_FINE_MOCK) {
    return mockCheckGuestFineDebt(input.documentNumber);
  }
  const payload: GuestFineCheckRequest = {
    ...input,
    categoryCode: GUEST_FINE_CATEGORY_CODE,
  };
  try {
    const response = await apiClient.post<GuestFineCheckEnvelope>(
      `${EpsApiBase}${ApiPaths.guestFineDebtCheck}`,
      { data: payload },
    );
    return mapGuestFineCheckResult(response.data?.data);
  } catch (err: unknown) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return { found: false };
    }
    throw err;
  }
}
