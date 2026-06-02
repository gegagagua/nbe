import type { GuestFineCheckResult } from '@/types/guest-fine';

export function mapGuestFineCheckResult(data: unknown): GuestFineCheckResult {
  if (!data || typeof data !== 'object') {
    return { found: false };
  }
  const record = data as Record<string, unknown>;
  const amount = record.amount ?? record.debtAmount ?? record.debtSum;
  const found = record.found === true || amount != null;
  if (!found) {
    return { found: false };
  }
  return {
    found: true,
    amount: amount != null ? String(amount) : undefined,
    currency: typeof record.currency === 'string' ? record.currency : 'GEL',
    paymentUrl: typeof record.paymentUrl === 'string' ? record.paymentUrl : null,
  };
}
