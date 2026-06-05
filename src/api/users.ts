import { ApiPaths, BASE_URL } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import type {
    CheckVerificationRequest,
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
    `${UmPubApiBase}${ApiPaths.usersVerifyPhone}`,
    { data: payload },
  );
  const { verificationUrl, verificationId } = response.data.data;
  return { verificationUrl, verificationId };
}

export async function checkVerification(verificationId: number): Promise<void> {
  const payload: CheckVerificationRequest = { verificationId };
  await apiClient.post(`${UmPubApiBase}${ApiPaths.usersVerificationCheck}`, {
    data: payload,
  });
}

export async function getUser(userId: number): Promise<UserDetail> {
  const response = await apiClient.get<GetUserResponse>(
    ApiPaths.userById(userId),
    {
      headers: { "X-User-ID": String(userId) },
    },
  );
  return response.data.data;
}

export async function updateUserPassword(
  userId: number,
  payload: UpdateUserPasswordRequest,
): Promise<void> {
  await apiClient.put(
    ApiPaths.userPasswordUpdate,
    { data: payload },
    { headers: { "X-User-ID": String(userId) } },
  );
}

export async function updateUser(
  userId: number,
  payload: UpdateUserRequest,
): Promise<void> {
  await apiClient.put(
    ApiPaths.userById(userId),
    { data: payload },
    { headers: { "X-User-ID": String(userId) } },
  );
}
