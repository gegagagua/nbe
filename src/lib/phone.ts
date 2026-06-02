const GE_COUNTRY_CODE = '995';

/**
 * Normalize a Georgian mobile number to E.164-like `995XXXXXXXXX` (no `+`).
 * Strips non-digits, prepends `995` when missing.
 */
export function normalizeGeorgianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith(GE_COUNTRY_CODE)) {
    return digits;
  }
  return `${GE_COUNTRY_CODE}${digits}`;
}

export function formatGeorgianPhoneForInput(phone: string | null | undefined): string {
  if (!phone?.trim()) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith(GE_COUNTRY_CODE) && digits.length >= 12) {
    return digits.slice(GE_COUNTRY_CODE.length);
  }
  return digits;
}
