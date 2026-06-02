import { mapUserGroupsForUpdate } from '@/lib/map-user-groups-for-update';
import { normalizeGeorgianPhone } from '@/lib/phone';
import type { ProfileInfoEditValues } from '@/schemas/profile-info-edit.schema';
import type { UpdateUserRequest, UserDetail } from '@/types/users';

export function buildUpdateUserPayload(
  detail: UserDetail,
  values: ProfileInfoEditValues,
): UpdateUserRequest {
  const agencyId = detail.agency?.id;
  const userGroups = mapUserGroupsForUpdate(detail.userGroups);
  const realAddress = values.realAddress.trim();
  const legalAddress = values.legalAddress.trim();
  const phone = values.phone.trim();
  const email = values.email.trim();

  return {
    ...(agencyId !== undefined ? { agencyId } : {}),
    username: detail.username,
    firstName: detail.firstName,
    lastName: detail.lastName,
    ...(realAddress ? { realAddress } : {}),
    ...(legalAddress ? { legalAddress } : {}),
    ...(phone ? { phone: normalizeGeorgianPhone(phone) } : {}),
    ...(email ? { email } : {}),
    ...(detail.idnumber ? { idnumber: detail.idnumber } : {}),
    ...(detail.prntUserId != null ? { prntUserId: detail.prntUserId } : {}),
    contacts: detail.contacts ?? [],
    ...(userGroups.length > 0 ? { userGroups } : {}),
  };
}
