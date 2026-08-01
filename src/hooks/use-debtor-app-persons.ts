import { useQuery } from '@tanstack/react-query';

import { getDebtorAppPersons } from '@/api/debtor-apps';

export function useDebtorAppPersons(appId: number | null) {
  const query = useQuery({
    queryKey: ['debtor-persons', appId],
    queryFn: () => getDebtorAppPersons(appId as number),
    enabled: appId != null,
  });

  const persons = query.data ?? [];
  // The payer is the person carrying the payment identifier; fall back to the
  // first applicant when the backend hasn't issued a payCode yet.
  const payer = persons.find((p) => (p.payCode ?? '').trim().length > 0) ?? persons[0];

  return {
    ...query,
    persons,
    payer,
    personId: payer?.id ?? null,
    payCode: payer?.payCode?.trim() || null,
  };
}
