import { useQuery } from '@tanstack/react-query';

import { getDebtorAppPayments } from '@/api/debtor-apps';

export function useDebtorAppPayments(appId: number | null) {
  return useQuery({
    queryKey: ['debtor-payments', appId],
    queryFn: () => getDebtorAppPayments(appId as number),
    enabled: appId != null,
  });
}
