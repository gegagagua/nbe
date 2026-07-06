import { ApiPaths, BASE_URL } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import type {
  CheckVerificationRequest,
  CheckVerificationResponse,
  CheckVerificationResult,
  CreatePortalUserRequest,
  CreatePortalUserResponse,
  GetUserResponse,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
  UserDetail,
  VerifyPhoneOtpRequest,
  VerifyPhoneOtpResponse,
} from "@/types/users";

export async function createPortalUser(
  payload: CreatePortalUserRequest,
): Promise<number> {
  const response = await apiClient.post<CreatePortalUserResponse>(
    `${BASE_URL}${ApiPaths.usersCreate}`,
    { data: payload },
  );
  return response.data.data.userId;
}

export async function verifyPhoneOtp(
  userId: number,
  code: string,
): Promise<{ verificationUrl: string; verificationId: number }> {
  const payload: VerifyPhoneOtpRequest = { userId, code };
  const response = await apiClient.post<VerifyPhoneOtpResponse>(
    `${BASE_URL}${ApiPaths.usersVerifyPhone}`,
    { data: payload },
  );
  const { verificationUrl, verificationId } = response.data.data;
  return { verificationUrl, verificationId };
}

export async function checkVerification(
  verificationId: number,
): Promise<CheckVerificationResult> {
  const payload: CheckVerificationRequest = { verificationId };
  const response = await apiClient.post<CheckVerificationResponse>(
    `${BASE_URL}${ApiPaths.usersVerificationCheck}`,
    { data: payload },
  );
  // Prefer the enveloped `data`; fall back to the raw body so nothing is lost
  // if the endpoint returns fields at the top level.
  return response.data?.data ?? (response.data as CheckVerificationResult) ?? {};
}

export async function changePassword(
  payload: UpdateUserPasswordRequest,
): Promise<void> {
  await apiClient.put(ApiPaths.passwordGhange, { data: payload });
}

export async function getUserMe(): Promise<UserDetail> {
  const response = await apiClient.get<GetUserResponse>(ApiPaths.usersMe);
  return response.data.data;
}

export async function updateUserMe(payload: UpdateUserRequest): Promise<void> {
  await apiClient.put(ApiPaths.usersMeUpdate, { data: payload });
}

/**
 * Dedicated phone-change endpoint. The generic /users PUT doesn't persist phone
 * changes, so the number goes through the verification/phone endpoint instead.
 */
export async function updateUserPhone(phone: string): Promise<void> {
  await apiClient.post(`${BASE_URL}${ApiPaths.usersChangePhone}`, {
    data: { phone },
  });
}

/**
 * Confirm a pending phone change with the OTP sent to the new number. Unlike
 * the registration `verifyPhoneOtp`, this responds with an empty body, so the
 * response is ignored — a non-error status means the change was applied.
 */
export async function confirmUserPhone(
  userId: number,
  code: string,
): Promise<void> {
  await apiClient.post(`${BASE_URL}${ApiPaths.usersVerifyPhone}`, {
    data: { userId, code },
  });
}
