import { ApiPaths, BASE_URL } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import type {
  CheckVerificationRequest,
  CheckVerificationResponse,
  CheckVerificationResult,
  CreatePortalUserRequest,
  CreatePortalUserResponse,
  GetLegalEntitiesResponse,
  GetUserResponse,
  LegalEntity,
  RawLegalEntity,
  UpdateLegalEntityRequest,
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

/**
 * The legal (registered) address arrives under `legalAddress` — the key the
 * physical-user record also uses — not `address`, which is why it was coming
 * through empty. Read either key (plus the actual-address variants) so the
 * юridical address is always surfaced regardless of which the backend sends.
 */
function normalizeLegalEntity(raw: RawLegalEntity): LegalEntity {
  return {
    id: raw.id,
    name: raw.name,
    legalNumber: raw.legalNumber,
    memberTypeId: raw.memberTypeId ?? null,
    memberName: raw.memberName ?? null,
    address: raw.legalAddress ?? raw.address ?? null,
    realAddress: raw.realAddress ?? raw.actualAddress ?? null,
    email: raw.email ?? null,
  };
}

export async function getLegalEntities(): Promise<LegalEntity[]> {
  const response = await apiClient.get<GetLegalEntitiesResponse>(
    ApiPaths.legalEntities,
  );
  return (response.data.data ?? []).map(normalizeLegalEntity);
}

export async function updateLegalEntity(
  id: number,
  payload: UpdateLegalEntityRequest,
): Promise<void> {
  await apiClient.put(ApiPaths.legalEntityById(id), { data: payload });
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
