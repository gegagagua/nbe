import { useCallback, useState } from 'react';

import { useDebtorApps } from '@/hooks/use-debtor-apps';
import { isGuestMode } from '@/lib/guest-mode';
import type { DebtorSearchFilters } from '@/types/debtor-registry';

import { DebtorRegistrySearchForm } from './debtor-registry-search-form';
import { DebtorRegistryScreenInner } from './debtor-registry-screen-inner';

type Props = { displayName: string };

export function DebtorRegistryScreenLive({ displayName }: Props) {
  const [draftApplicant, setDraftApplicant] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<DebtorSearchFilters>({});
  const [page, setPage] = useState(0);

  // Guests can open this screen but the list is hidden and they have no session
  // token — skip the query so we don't fire a guaranteed-401 request.
  const query = useDebtorApps(appliedFilters, page, { enabled: !isGuestMode() });
  const items = query.data?.data ?? [];
  const pageInfo = query.data?.page;
  const loading = query.isPending;
  const empty = !loading && items.length === 0;

  const handleSearch = useCallback(() => {
    const requestedPersonIdNumber = draftApplicant.trim();
    if (!requestedPersonIdNumber) return;
    setAppliedFilters({ requestedPersonIdNumber });
    setPage(0);
  }, [draftApplicant]);

  const handleClear = useCallback(() => {
    setDraftApplicant('');
    setAppliedFilters({});
    setPage(0);
  }, []);

  return (
    <DebtorRegistryScreenInner
      displayName={displayName}
      items={items}
      loading={loading}
      empty={empty}
      searchForm={
        <DebtorRegistrySearchForm
          applicantValue={draftApplicant}
          onApplicantChange={setDraftApplicant}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      }
      pageInfo={pageInfo}
      page={page}
      setPage={setPage}
    />
  );
}
