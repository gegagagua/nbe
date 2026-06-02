import { useCallback } from 'react';

import { verifyUserPassword } from '@/lib/verify-user-password';

export function useVerifyCurrentPassword(username: string | undefined) {
  return useCallback(
    async (password: string) => {
      if (!username?.trim()) return false;
      return verifyUserPassword(username, password);
    },
    [username],
  );
}
