import { router } from "expo-router";

import { logoutSession } from "@/api/sessions";
import { clearFaceIdAll } from "@/lib/face-id-storage";
import { setGuestMode } from "@/lib/guest-mode";
import { clearPasswordHistory } from "@/lib/password-history-storage";
import { clearAppQueryCache } from "@/lib/query-client";
import { clearSessionToken } from "@/lib/session-token-storage";
import { clearSessionUserProfile } from "@/lib/session-user-profile-storage";

export async function signOut(): Promise<void> {
  logoutSession().catch(() => undefined);

  clearAppQueryCache();
  setGuestMode(false);
  await Promise.all([
    clearSessionToken(),
    clearSessionUserProfile(),
    clearFaceIdAll(),
    clearPasswordHistory(),
  ]);
  router.replace("/");
}
