import { router } from "expo-router";

import { setGuestMode } from "@/lib/guest-mode";
import { clearAppQueryCache } from "@/lib/query-client";
import { clearSessionToken } from "@/lib/session-token-storage";
import { clearSessionUserProfile } from "@/lib/session-user-profile-storage";

export async function signOut(): Promise<void> {
  console.log("signOut");
  // fire-and-forget — don't wait for the server response
  // void logoutSession().catch(() => undefined);

  clearAppQueryCache();
  setGuestMode(false);
  await Promise.all([clearSessionToken(), clearSessionUserProfile()]);
  router.replace("/");
}
