import { ApiPaths, BASE_URL } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import type {
  CheckVerificationRequest,
  CreatePortalUserRequest,
  CreatePortalUserResponse,
  GetUserResponse,
  UpdateUserPasswordRequest,
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

export async function checkVerification(verificationId: number): Promise<void> {
  const payload: CheckVerificationRequest = { verificationId };
  await apiClient.post(`${BASE_URL}${ApiPaths.usersVerificationCheck}`, {
    data: payload,
  });
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
