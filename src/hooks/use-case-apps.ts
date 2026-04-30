import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { searchCases } from '@/api/cases';
import i18n from '@/i18n/i18n';
import { showErrorToast } from '@/lib/show-error-toast';
import type { CaseSearchFilters } from '@/types/case-management';

export function useCaseApps(
  filters: CaseSearchFilters,
  pageNumber: number,
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryKey: ['case-apps', filters, pageNumber],
    queryFn: () => searchCases(filters, pageNumber),
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t('cases.listError'), query.error);
    }
  }, [query.error]);

  return query;
}
