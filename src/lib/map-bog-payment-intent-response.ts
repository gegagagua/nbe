import type { BogPaymentIntentResult } from '@/types/payment-intent';

const URL_FIELDS = [
  'url',
  'paymentUrl',
  'redirectUrl',
  'redirectURL',
  'paymentLink',
  'checkoutUrl',
  'intentUrl',
] as const;

function readUrlFromRecord(record: Record<string, unknown>): string | null {
  for (const field of URL_FIELDS) {
    const value = record[field];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return null;
}

export function mapBogPaymentIntentResponse(raw: unknown): BogPaymentIntentResult | null {
  if (!raw || typeof raw !== 'object') return null;

  const root = raw as Record<string, unknown>;
  const direct = readUrlFromRecord(root);
  if (direct) return { paymentUrl: direct };

  const nested = root.data;
  if (nested && typeof nested === 'object') {
    const url = readUrlFromRecord(nested as Record<string, unknown>);
    if (url) return { paymentUrl: url };
  }

  return null;
}
