import { router } from 'expo-router';

import { logoutSession } from '@/api/sessions';
import { clearSessionToken } from '@/lib/session-token-storage';
import { clearSessionUserProfile } from '@/lib/session-user-profile-storage';

export async function signOut(): Promise<void> {
  // fire-and-forget — don't wait for the server response
  void logoutSession().catch(() => undefined);

  await Promise.all([clearSessionToken(), clearSessionUserProfile()]);
  router.replace('/');
}
