import { QueryClient } from '@tanstack/react-query';

let appQueryClient: QueryClient | null = null;

export function createAppQueryClient() {
  appQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
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
