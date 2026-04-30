import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { searchCases } from '@/api/cases';
import { CaseManagementCopy } from '@/constants/case-management-copy';
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
      showErrorToast(CaseManagementCopy.listError, query.error);
    }
  }, [query.error]);

  return query;
}
