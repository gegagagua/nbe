import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchAppDemandSummary } from '@/api/demands';
import { useSessionUserProfile } from '@/hooks/use-session-user-profile';
import type { AppDemandSummary } from '@/types/case-demands';

export function useCaseListDebts(appIds: number[]): Map<number, AppDemandSummary> {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery = userId != null && userId > 0;

  const queries = useQueries({
    queries: appIds.map((appId) => ({
      queryKey: ['case-demands', userId, appId],
      queryFn: () => fetchAppDemandSummary(appId, userId!),
      enabled: canQuery,
      staleTime: 60_000,
    })),
  });

  const queryData = queries.map((query) => query.data);

  return useMemo(() => {
    const debtsByAppId = new Map<number, AppDemandSummary>();
    appIds.forEach((appId, index) => {
      const summary = queryData[index];
      if (summary) debtsByAppId.set(appId, summary);
    });
    return debtsByAppId;
  }, [appIds, queryData]);
}
