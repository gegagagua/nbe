import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { searchCases } from '@/api/cases';
import i18n from '@/i18n/i18n';
import { showErrorToast } from '@/lib/show-error-toast';
import { useSessionUserProfile } from '@/hooks/use-session-user-profile';
import type { CaseSearchFilters } from '@/types/case-management';

export function useCaseApps(
  filters: CaseSearchFilters,
  pageNumber: number,
  options?: { enabled?: boolean },
) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery = (options?.enabled ?? true) && userId != null && userId > 0;

  const query = useQuery({
    queryKey: ['case-apps', userId, filters, pageNumber],
    queryFn: () => searchCases(userId!, filters, pageNumber),
    enabled: canQuery,
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t('cases.listError'), query.error);
    }
  }, [query.error]);

  return query;
}
