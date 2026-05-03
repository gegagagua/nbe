import { useState } from 'react';

import { useDebtorApps } from '@/hooks/use-debtor-apps';
import type { DebtorSearchFilters } from '@/types/debtor-registry';

import { DebtorRegistryScreenInner } from './debtor-registry-screen-inner';

type Props = { displayName: string };

export function DebtorRegistryScreenLive({ displayName }: Props) {
  const [filters] = useState<DebtorSearchFilters>({});
  const [page, setPage] = useState(0);
  const query = useDebtorApps(filters, page);
  const items = query.data?.data ?? [];
  const pageInfo = query.data?.page;
  const loading = query.isPending;
  const empty = !loading && items.length === 0;

  return (
    <DebtorRegistryScreenInner
      displayName={displayName}
      items={items}
      loading={loading}
      empty={empty}
      pageInfo={pageInfo}
      page={page}
      setPage={setPage}
    />
  );
}
