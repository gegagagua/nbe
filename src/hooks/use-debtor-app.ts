import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getDebtorApp } from '@/api/debtor-apps';
import i18n from '@/i18n/i18n';
import { showErrorToast } from '@/lib/show-error-toast';

export function useDebtorApp(appId: number | null) {
  const query = useQuery({
    queryKey: ['debtor-app', appId],
    queryFn: () => getDebtorApp(appId as number),
    enabled: appId != null,
  });

  useEffect(() => {
    if (query.error) {
      showErrorToast(i18n.t('debtors.detailLoadError'), query.error);
    }
  }, [query.error]);

  return query;
}
