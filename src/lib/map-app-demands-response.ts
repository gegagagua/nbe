import type { AppDemandSummary } from '@/types/case-demands';
import { formatGelAmount } from '@/utils/format-gel-amount';

function normalizeDemandRows(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) {
    return raw.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object');
  }
  if (!raw || typeof raw !== 'object') return [];
  const root = raw as Record<string, unknown>;
  if (Array.isArray(root.data)) {
    return root.data.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object');
  }
  if (root.data && typeof root.data === 'object') {
    const nested = root.data as Record<string, unknown>;
    if (Array.isArray(nested.content)) {
      return nested.content.filter(
        (row): row is Record<string, unknown> => !!row && typeof row === 'object',
      );
    }
  }
  if (Array.isArray(root.content)) {
    return root.content.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object');
  }
  return [];
}

function readAmount(row: Record<string, unknown>): number | null {
  const fields = ['amount', 'demandAmount', 'claimedAmount', 'totalAmount', 'sum', 'value'];
  for (const field of fields) {
    const value = row[field];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return null;
}

function readCategoryName(row: Record<string, unknown>): string | null {
  if (typeof row.debtCategoryName === 'string') return row.debtCategoryName;
  if (typeof row.debtCategory === 'string') return row.debtCategory;
  if (typeof row.categoryName === 'string') return row.categoryName;
  const category = row.category ?? row.debtCategory ?? row.trCategory;
  if (category && typeof category === 'object') {
    const name = (category as Record<string, unknown>).name;
    if (typeof name === 'string') return name;
  }
  return null;
}

export function mapAppDemandsResponse(raw: unknown): AppDemandSummary | null {
  const rows = normalizeDemandRows(raw);
  if (rows.length === 0) return null;

  let totalAmount = 0;
  let hasAmount = false;
  const categories = new Set<string>();

  for (const row of rows) {
    const amount = readAmount(row);
    if (amount != null) {
      totalAmount += amount;
      hasAmount = true;
    }
    const category = readCategoryName(row);
    if (category) categories.add(category);
  }

  const debtCategoryName = categories.size > 0 ? [...categories].join(', ') : null;
  const debtAmountDisplay = hasAmount ? formatGelAmount(totalAmount) : null;

  if (!debtCategoryName && !debtAmountDisplay) return null;
  return { debtCategoryName, debtAmountDisplay };
}
