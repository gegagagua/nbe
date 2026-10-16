import { QueryClient } from '@tanstack/react-query';

let appQueryClient: QueryClient | null = null;

export function createAppQueryClient() {
  appQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        // Keep responses cached for 5 min after they go unused so back/forward
        // navigation on web reuses data instead of refetching.
        gcTime: 5 * 60_000,
        retry: 1,
        // Avoid refetch storms when users switch browser tabs on the web build.
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return appQueryClient;
}

export function clearAppQueryCache(): void {
  appQueryClient?.clear();
}

/**
 * Drops cached data and refetches the queries of screens that are currently
 * mounted. Used when the acting account changes, so open screens reload with
 * the new account instead of keeping the previous account's data.
 */
export function resetAppQueries(): void {
  appQueryClient?.resetQueries();
}
