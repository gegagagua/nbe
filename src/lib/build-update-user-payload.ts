import { mapUserGroupsForUpdate } from '@/lib/map-user-groups-for-update';
import { normalizeGeorgianPhone } from '@/lib/phone';
import type { ProfileInfoEditValues } from '@/schemas/profile-info-edit.schema';
import type { UpdateUserRequest, UserContact, UserDetail } from '@/types/users';

const isPhoneType = (type?: string) => /mobile|phone|sms|cell/i.test(type ?? '');
const isEmailType = (type?: string) => /e[-_]?mail/i.test(type ?? '');

/**
 * Rebuild the contacts array with the freshly edited phone/email values. The
 * backend merges contacts by `id`, so an edited phone/email must reuse the
 * existing entry's `id` (and `type`) — otherwise the old contact is left in
 * place and the change never shows up. We therefore update matching entries in
 * place, drop any duplicates, and only append a brand-new contact when none
 * existed before.
 */
function buildUpdatedContacts(
  existing: UserContact[] | undefined,
  phone: string,
  email: string,
): UserContact[] {
  const contacts: UserContact[] = [];
  let phoneApplied = false;
  let emailApplied = false;

  for (const entry of existing ?? []) {
    if (isPhoneType(entry.type)) {
      if (phone && !phoneApplied) {
        contacts.push({ ...entry, contact: normalizeGeorgianPhone(phone) });
        phoneApplied = true;
      }
      continue;
    }
    if (isEmailType(entry.type)) {
      if (email && !emailApplied) {
        contacts.push({ ...entry, contact: email });
        emailApplied = true;
      }
      continue;
    }
    contacts.push(entry);
  }

  if (phone && !phoneApplied) {
    contacts.push({ type: 'MOBILE', contact: normalizeGeorgianPhone(phone) });
  }
  if (email && !emailApplied) {
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
