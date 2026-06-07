import type { GuestFineCheckResult } from '@/types/guest-fine';

export function mapGuestFineCheckResult(data: unknown): GuestFineCheckResult {
  if (!data || typeof data !== 'object') {
    return { found: false };
  }

  const record = data as Record<string, unknown>;
  const amount =
    record.amount ??
    record.debtAmount ??
    record.debtSum ??
    record.payAmount ??
    record.sum ??
    record.totalAmount;
  const paymentUrl =
    record.paymentUrl ?? record.payUrl ?? record.paymentLink ?? record.url;
  const found =
    record.found === true ||
    record.hasDebt === true ||
    amount != null ||
    (typeof paymentUrl === 'string' && paymentUrl.length > 0);

  if (!found) {
    return { found: false };
  }

  return {
    found: true,
    amount: amount != null ? String(amount) : undefined,
    currency: typeof record.currency === 'string' ? record.currency : 'GEL',
    paymentUrl: typeof paymentUrl === 'string' ? paymentUrl : null,
  };
}
