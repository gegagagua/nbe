import type {
  GuestFineCheckResult,
  PaymentInfoItem,
  PaymentInfoPerson,
} from '@/types/guest-fine';

function formatGelAmount(amount: number | string): string {
  const value = typeof amount === 'number' ? amount : Number.parseFloat(amount);
  if (Number.isNaN(value)) return String(amount);
  return value.toFixed(2);
}

function normalizePaymentInfoItems(data: unknown): PaymentInfoItem[] {
  if (Array.isArray(data)) {
    return data.filter((item): item is PaymentInfoItem => !!item && typeof item === 'object');
  }
  if (!data || typeof data !== 'object') return [];
  const record = data as Record<string, unknown>;
  if (Array.isArray(record.data)) {
    return record.data.filter((item): item is PaymentInfoItem => !!item && typeof item === 'object');
  }
  return [record as PaymentInfoItem];
}

function mapPaymentInfoItem(item: PaymentInfoItem): GuestFineCheckResult {
  const amount = item.amount;
  const personName = item.person?.name?.trim();
  const appId = item.appId;
  const personId = item.person?.personId;
  const paymentContext =
    appId != null && personId != null && amount != null
      ? {
          destType: item.destType ?? 'EPS',
          appId,
          personId,
          amount,
        }
      : null;

  if (amount == null && !personName) {
    return { found: false };
  }

  return {
    found: true,
    personName: personName || undefined,
    amount: amount != null ? formatGelAmount(amount) : undefined,
    currency: 'GEL',
    paymentUrl: null,
    paymentContext,
  };
}

function mapLegacyRecord(record: Record<string, unknown>): GuestFineCheckResult {
  const amount =
    record.amount ??
    record.debtAmount ??
    record.debtSum ??
    record.payAmount ??
    record.sum ??
    record.totalAmount;
  const paymentUrl =
    record.paymentUrl ?? record.payUrl ?? record.paymentLink ?? record.url;
  const personName =
    typeof record.name === 'string'
      ? record.name
      : typeof (record.person as PaymentInfoPerson | undefined)?.name === 'string'
        ? (record.person as PaymentInfoPerson).name
        : undefined;
  const found =
    record.found === true ||
    record.hasDebt === true ||
    amount != null ||
    (typeof paymentUrl === 'string' && paymentUrl.length > 0);

  if (!found) return { found: false };

  return {
    found: true,
    personName: personName?.trim() || undefined,
    amount: amount != null ? formatGelAmount(amount as number | string) : undefined,
    currency: typeof record.currency === 'string' ? record.currency : 'GEL',
    paymentUrl: typeof paymentUrl === 'string' ? paymentUrl : null,
  };
}

export function mapGuestFineCheckResult(data: unknown): GuestFineCheckResult {
  const items = normalizePaymentInfoItems(data);
  if (items.length > 0) {
    return mapPaymentInfoItem(items[0]);
  }
  if (!data || typeof data !== 'object') {
    return { found: false };
  }
  return mapLegacyRecord(data as Record<string, unknown>);
}
