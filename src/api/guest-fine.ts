import { isAxiosError } from "axios";

import { ApiPaths } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import { mapGuestFineCheckResult } from "@/lib/map-guest-fine-check-result";
import type {
  GuestFineCheckResult,
  PaymentInfoRequest,
} from "@/types/guest-fine";

type PaymentInfoEnvelope = { data: unknown };

export async function checkGuestFineDebt(input: {
  idNumber: string;
  documentNumber: string;
}): Promise<GuestFineCheckResult> {
  const payload: PaymentInfoRequest = {
    idnumber: input.idNumber.trim(),
    docNo: input.documentNumber.trim(),
  };

  try {
    const response = await apiClient.post<PaymentInfoEnvelope>(
      ApiPaths.paymentInfo,
      payload,
    );
    return mapGuestFineCheckResult(response.data);
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      if (err.response?.status === 404) {
        return { found: false };
      }
    }
    throw err;
  }
}
