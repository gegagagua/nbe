import type { UserContact } from '@/types/users';

function pickContact(
  contacts: UserContact[] | undefined,
  matchesType: (type: string) => boolean,
): string | null {
  if (!contacts?.length) return null;
  for (const entry of contacts) {
    const type = (entry.type ?? '').trim();
    const value = entry.contact?.trim();
    if (!value || !matchesType(type)) continue;
    return value;
  }
  return null;
}

export function resolveUserPhone(contacts: UserContact[] | undefined): string | null {
  return pickContact(contacts, (type) => {
    const upper = type.toUpperCase();
    return (
      upper === 'MOBILE' ||
      upper === 'PHONE' ||
      upper === 'SMS' ||
      upper === 'CELL' ||
      /mobile|phone|sms/i.test(type)
    );
  });
}

export function resolveUserEmail(contacts: UserContact[] | undefined): string | null {
  return pickContact(contacts, (type) => {
    const upper = type.toUpperCase();
    return upper === 'EMAIL' || upper === 'E_MAIL' || /email|mail/i.test(type);
  });
}
