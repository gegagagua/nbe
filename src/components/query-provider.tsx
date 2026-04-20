import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { createAppQueryClient } from '@/lib/query-client';
import type { QueryProviderProps } from '@/types/query-provider';

export function QueryProvider({ children }: QueryProviderProps) {
  const [client] = useState(() => createAppQueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
