import { router } from 'expo-router';

import { clearSessionToken } from '@/lib/session-token-storage';
import { clearSessionUserProfile } from '@/lib/session-user-profile-storage';

export async function signOut(): Promise<void> {
  await clearSessionToken();
  await clearSessionUserProfile();
  router.replace('/');
}
