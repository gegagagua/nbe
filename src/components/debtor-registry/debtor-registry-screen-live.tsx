import { useCallback, useState } from 'react';

import { useDebtorApps } from '@/hooks/use-debtor-apps';
import type { DebtorSearchFilters } from '@/types/debtor-registry';

import { DebtorRegistrySearchForm } from './debtor-registry-search-form';
import { DebtorRegistryScreenInner } from './debtor-registry-screen-inner';

type Props = { displayName: string };

export function DebtorRegistryScreenLive({ displayName }: Props) {
  const [draftApplicant, setDraftApplicant] = useState('');
  const [draftSubject, setDraftSubject] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<DebtorSearchFilters>({});
  const [page, setPage] = useState(0);

  const query = useDebtorApps(appliedFilters, page);
  const items = query.data?.data ?? [];
  const pageInfo = query.data?.page;
  const loading = query.isPending;
  const empty = !loading && items.length === 0;

  const handleSearch = useCallback(() => {
    const applicantPersonalNumber = draftApplicant.trim();
    if (!applicantPersonalNumber) return;
    const requestedSubjectIdentifier = draftSubject.trim();
    setAppliedFilters(
      requestedSubjectIdentifier
        ? { applicantPersonalNumber, requestedSubjectIdentifier }
        : { applicantPersonalNumber },
    );
    setPage(0);
  }, [draftApplicant, draftSubject]);

  const handleClear = useCallback(() => {
    setDraftApplicant('');
    setDraftSubject('');
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
          subjectValue={draftSubject}
          onApplicantChange={setDraftApplicant}
          onSubjectChange={setDraftSubject}
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
