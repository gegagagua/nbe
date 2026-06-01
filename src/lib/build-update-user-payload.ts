import { mapUserGroupsForUpdate } from '@/lib/map-user-groups-for-update';
import type { UpdateUserRequest, UserDetail } from '@/types/users';

export function buildUpdateUserPayload(
  detail: UserDetail,
  firstName: string,
  lastName: string,
  address: string,
): UpdateUserRequest {
  const agencyId = detail.agency?.id;
  const userGroups = mapUserGroupsForUpdate(detail.userGroups);
  return {
    ...(agencyId !== undefined ? { agencyId } : {}),
    username: detail.username,
    firstName,
    lastName,
    realAddress: address,
    ...(detail.legalAddress ? { legalAddress: detail.legalAddress } : {}),
    ...(detail.idnumber ? { idnumber: detail.idnumber } : {}),
    ...(detail.prntUserId != null ? { prntUserId: detail.prntUserId } : {}),
    contacts: detail.contacts ?? [],
    ...(userGroups.length > 0 ? { userGroups } : {}),
  };
}
