import { useCallback } from 'react';

import { verifyUserPassword } from '@/lib/verify-user-password';
import type { CreateSessionResponse } from '@/types/session';

export function useVerifyCurrentPassword(username: string | undefined) {
  return useCallback(
    async (password: string): Promise<CreateSessionResponse | null> => {
      if (!username?.trim()) return null;
      return verifyUserPassword(username, password);
    },
    [username],
  );
}
