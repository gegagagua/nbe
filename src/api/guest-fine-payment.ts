import { ApiPaths, BASE_URL } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import { mapBogPaymentIntentResponse } from "@/lib/map-bog-payment-intent-response";
import type {
  BogPaymentIntentRequest,
  BogPaymentIntentResult,
} from "@/types/payment-intent";

export async function createBogPaymentIntent(
  input: BogPaymentIntentRequest,
): Promise<BogPaymentIntentResult> {
  const url = `${BASE_URL}${ApiPaths.paymentBogIntent}`;
  const body = {
    data: {
      destType: input.destType,
      appId: input.appId,
      personId: input.personId,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
    },
  };
  const response = await apiClient.post(ApiPaths.paymentBogIntent, body);

  const mapped = mapBogPaymentIntentResponse(response.data);
  if (!mapped) {
    throw new Error("BOG payment URL missing from response");
  }

  return mapped;
}
