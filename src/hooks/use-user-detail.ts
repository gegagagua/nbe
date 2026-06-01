import { useCallback, useEffect, useState } from 'react';

import { getUser } from '@/api/users';
import type { UserDetail } from '@/types/users';

export function useUserDetail(userId: number | undefined) {
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await getUser(userId);
      setDetail(data);
    } catch (err: unknown) {
      console.error('[useUserDetail]', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return { detail, isLoading, refetch: fetchDetail };
}
