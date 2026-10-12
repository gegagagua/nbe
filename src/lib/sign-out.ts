import { logoutSession } from "@/api/sessions";
import { setGuestMode } from "@/lib/guest-mode";
import { clearPasswordHistory } from "@/lib/password-history-storage";
import { clearAppQueryCache } from "@/lib/query-client";
import { resetStackTo } from "@/lib/reset-navigation";
import { clearActiveLegalEntity } from "@/lib/active-legal-entity-storage";
import { clearSessionToken } from "@/lib/session-token-storage";
import { clearSessionUserProfile } from "@/lib/session-user-profile-storage";

export async function signOut(): Promise<void> {
  logoutSession().catch(() => undefined);

  clearAppQueryCache();
  setGuestMode(false);
  await Promise.all([
    clearSessionToken(),
    clearSessionUserProfile(),
    clearActiveLegalEntity(),
    clearPasswordHistory(),
  ]);
  resetStackTo("/");
}
