import { mapUserGroupsForUpdate } from '@/lib/map-user-groups-for-update';
import { normalizeGeorgianPhone } from '@/lib/phone';
import type { ProfileInfoEditValues } from '@/schemas/profile-info-edit.schema';
import type { UpdateUserRequest, UserContact, UserDetail } from '@/types/users';

/**
 * Rebuild the contacts array, replacing any existing phone/email entries with
 * the freshly edited values. The backend reads contact details from this array,
 * so the updated phone/email must be present here (not only as top-level fields)
 * for the change to persist.
 */
function buildUpdatedContacts(
  existing: UserContact[] | undefined,
  phone: string,
  email: string,
): UserContact[] {
  const contacts = (existing ?? []).filter(
    (c) => !/mobile|phone|sms|cell|email|mail/i.test(c.type ?? ''),
  );
  if (phone) {
    contacts.push({ type: 'MOBILE', contact: normalizeGeorgianPhone(phone) });
  }
  if (email) {
    contacts.push({ type: 'EMAIL', contact: email });
  }
  return contacts;
}

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
    firstName: detail.firstName ?? '',
    lastName: detail.lastName ?? '',
    ...(realAddress ? { realAddress } : {}),
    ...(legalAddress ? { legalAddress } : {}),
    ...(phone ? { phone: normalizeGeorgianPhone(phone) } : {}),
    ...(email ? { email } : {}),
    ...(detail.idnumber ? { idnumber: detail.idnumber } : {}),
    ...(detail.prntUserId != null ? { prntUserId: detail.prntUserId } : {}),
    contacts: buildUpdatedContacts(detail.contacts, phone, email),
    ...(userGroups.length > 0 ? { userGroups } : {}),
  };
}
