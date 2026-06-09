import { mapCaseApplication } from '@/lib/map-case-application';
import type { CasePage, SearchCasesResponse } from '@/types/case-management';

const EMPTY_PAGE: CasePage = {
  totalRecords: 0,
  totalPages: 0,
  size: 10,
  number: 0,
};

function mapPage(raw: unknown, fallbackSize: number): CasePage {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_PAGE, size: fallbackSize };
  const p = raw as Record<string, unknown>;
  return {
    totalRecords: typeof p.totalRecords === 'number' ? p.totalRecords : 0,
    totalPages: typeof p.totalPages === 'number' ? p.totalPages : 0,
    size: typeof p.size === 'number' ? p.size : fallbackSize,
    number: typeof p.number === 'number' ? p.number : 0,
  };
}

export function mapSearchCasesResponse(raw: unknown): SearchCasesResponse {
  if (!raw || typeof raw !== 'object') {
    return { data: [], page: EMPTY_PAGE };
  }

  const root = raw as Record<string, unknown>;
  const nested = root.data;
  const list = Array.isArray(nested)
    ? nested
    : nested && typeof nested === 'object' && Array.isArray((nested as Record<string, unknown>).content)
      ? (nested as Record<string, unknown>).content
      : Array.isArray(root.content)
        ? root.content
        : [];

  const pageSource =
    root.page ??
    (nested && typeof nested === 'object' ? (nested as Record<string, unknown>).page : undefined);

  const page = mapPage(pageSource, list.length > 0 ? list.length : EMPTY_PAGE.size);
  const data = list.map(mapCaseApplication).filter((item): item is NonNullable<typeof item> => item !== null);

  return { data, page };
}
