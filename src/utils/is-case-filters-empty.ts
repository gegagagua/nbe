import type { CaseSearchFilters } from '@/types/case-management';

export function isCaseFiltersEmpty(f: CaseSearchFilters): boolean {
  const entries = Object.entries(f).filter(([, v]) => {
    if (v === undefined || v === null) {
      return false;
    }
    if (typeof v === 'string' && v.trim() === '') {
      return false;
    }
    if (typeof v === 'boolean') {
      return v === true;
    }
    return true;
  });
  return entries.length === 0;
}
