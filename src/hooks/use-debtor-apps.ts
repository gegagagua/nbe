import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { searchDebtorApps } from '@/api/debtor-apps';
import { DebtorRegistryCopy } from '@/constants/debtor-registry-copy';
import { showErrorToast } from '@/lib/show-error-toast';
import type { DebtorSearchFilters } from '@/types/debtor-registry';

export function useDebtorApps(filters: DebtorSearchFilters, pageNumber: number) {
  const query = useQuery({
    queryKey: ['debtor-apps', filters, pageNumber],
    queryFn: () => searchDebtorApps(filters, pageNumber),
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(DebtorRegistryCopy.listError, query.error);
    }
  }, [query.error]);

  return query;
}
