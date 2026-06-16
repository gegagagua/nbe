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

const INTENT_ID_FIELDS = ['paymentIntentId', 'intentId', 'id'] as const;

function readUrlFromRecord(record: Record<string, unknown>): string | null {
  for (const field of URL_FIELDS) {
    const value = record[field];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return null;
}

function readIntentIdFromRecord(record: Record<string, unknown>): string | null {
  for (const field of INTENT_ID_FIELDS) {
    const value = record[field];
    if (typeof value === 'string' && value.length > 0) return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return null;
}

export function mapBogPaymentIntentResponse(raw: unknown): BogPaymentIntentResult | null {
  if (!raw || typeof raw !== 'object') return null;

  const root = raw as Record<string, unknown>;
  const directUrl = readUrlFromRecord(root);
  const directId = readIntentIdFromRecord(root);
  if (directUrl) return { paymentUrl: directUrl, paymentIntentId: directId };

  const nested = root.data;
  if (nested && typeof nested === 'object') {
    const record = nested as Record<string, unknown>;
    const url = readUrlFromRecord(record);
    if (url) return { paymentUrl: url, paymentIntentId: readIntentIdFromRecord(record) };
  }

  return null;
}
