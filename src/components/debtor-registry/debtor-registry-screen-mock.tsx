import type { SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";

import { DEBTOR_REGISTRY_LAYOUT_MOCK_RESPONSE } from "@/constants/debtor-registry-layout-mock";
import type { DebtorSearchFilters } from "@/types/debtor-registry";

import { DebtorRegistryScreenInner } from "./debtor-registry-screen-inner";
import { DebtorRegistrySearchForm } from "./debtor-registry-search-form";

type Props = { displayName: string };

export function DebtorRegistryScreenMock({ displayName }: Props) {
  const data = DEBTOR_REGISTRY_LAYOUT_MOCK_RESPONSE;
  const [draftApplicant, setDraftApplicant] = useState("");
  const [draftSubject, setDraftSubject] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<DebtorSearchFilters>({});
  const noopSetPage = useCallback((_v: SetStateAction<number>) => {}, []);
  const canQuery =
    Boolean(appliedFilters.applicantPersonalNumber?.trim()) &&
    Boolean(appliedFilters.requestedSubjectIdentifier?.trim());

  const items = useMemo(() => {
    if (!canQuery) return data.data;
    const applicantFilter = appliedFilters.applicantPersonalNumber?.trim();
    const subjectFilter = appliedFilters.requestedSubjectIdentifier?.trim();
    return data.data.filter((app) => {
      const applicantId = app.applicants?.[0]?.idnumber?.trim();
      const requestedId = app.requestedPerson?.idnumber?.trim();
      return applicantId === applicantFilter && requestedId === subjectFilter;
    });
  }, [appliedFilters, canQuery, data.data]);

  const handleSearch = useCallback(() => {
    const applicantPersonalNumber = draftApplicant.trim();
    const requestedSubjectIdentifier = draftSubject.trim();
    if (!applicantPersonalNumber || !requestedSubjectIdentifier) return;
    setAppliedFilters({
      applicantPersonalNumber,
      requestedSubjectIdentifier,
    });
  }, [draftApplicant, draftSubject]);

  const handleClear = useCallback(() => {
    setDraftApplicant("");
    setDraftSubject("");
    setAppliedFilters({});
  }, []);

  return (
    <DebtorRegistryScreenInner
      displayName={displayName}
      items={items}
      loading={false}
      empty={items.length === 0}
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
      pageInfo={data.page}
      page={0}
      setPage={noopSetPage}
    />
  );
}
