import { ApiPaths, UmPubApiBase } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import type {
  CreatePortalUserRequest,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
} from "@/types/users";

export async function createPortalUser(
  payload: CreatePortalUserRequest,
): Promise<void> {
  return await apiClient.post(`${UmPubApiBase}${ApiPaths.usersCreate}`, {
    data: payload,
  });
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
