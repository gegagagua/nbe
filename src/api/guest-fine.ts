import { isAxiosError } from "axios";

import { ApiPaths, BASE_URL } from "@/constants/api";
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
  const url = `${BASE_URL}${ApiPaths.paymentInfo}`;
  const payload: PaymentInfoRequest = {
    idnumber: input.idNumber.trim(),
    docNo: input.documentNumber.trim(),
  };
  const requestBody = { data: payload };

  console.log("[payment-info] URL:", url);

  try {
    const response = await apiClient.post<PaymentInfoEnvelope>(
      ApiPaths.paymentInfo,
      payload,
    );
    console.log(
      "[payment-info] response:",
      JSON.stringify(response.data, null, 2),
    );
    return mapGuestFineCheckResult(response.data?.data);
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      console.log(
        "[payment-info] error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2),
      );
      if (err.response?.status === 404) {
        return { found: false };
      }
    }
    throw err;
  }
}
