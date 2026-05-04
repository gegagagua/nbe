import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { searchDebtorApps } from '@/api/debtor-apps';
import i18n from '@/i18n/i18n';
import { showErrorToast } from '@/lib/show-error-toast';
import type { DebtorSearchFilters } from '@/types/debtor-registry';

export function useDebtorApps(
  filters: DebtorSearchFilters,
  pageNumber: number,
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryKey: ['debtor-apps', filters, pageNumber],
    queryFn: () => searchDebtorApps(filters, pageNumber),
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t('debtors.listError'), query.error);
    }
  }, [query.error]);

  return query;
}
