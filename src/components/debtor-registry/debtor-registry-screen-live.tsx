import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDebtorApps } from '@/hooks/use-debtor-apps';
import type { DebtorSearchFilters } from '@/types/debtor-registry';

import { DebtorRegistrySearchForm } from './debtor-registry-search-form';
import { DebtorRegistryScreenInner } from './debtor-registry-screen-inner';

type Props = { displayName: string };

export function DebtorRegistryScreenLive({ displayName }: Props) {
  const { t } = useTranslation();
  const [draftApplicant, setDraftApplicant] = useState('');
  const [draftSubject, setDraftSubject] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<DebtorSearchFilters>({});
  const [page, setPage] = useState(0);

  const canQuery =
    Boolean(appliedFilters.applicantPersonalNumber?.trim()) &&
    Boolean(appliedFilters.requestedSubjectIdentifier?.trim());

  const query = useDebtorApps(appliedFilters, page, { enabled: canQuery });

  const items = canQuery ? (query.data?.data ?? []) : [];
  const pageInfo = canQuery ? query.data?.page : undefined;
  const loading = canQuery && query.isPending;
  const empty = !loading && items.length === 0;

  const handleSearch = useCallback(() => {
    const applicantPersonalNumber = draftApplicant.trim();
    const requestedSubjectIdentifier = draftSubject.trim();
    if (!applicantPersonalNumber || !requestedSubjectIdentifier) return;
    setAppliedFilters({
      applicantPersonalNumber,
      requestedSubjectIdentifier,
    });
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
      listEmptyText={!canQuery ? t('debtors.searchHint') : undefined}
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
