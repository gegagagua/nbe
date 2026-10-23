import { logoutSession } from "@/api/sessions";
import { clearActiveLegalEntity } from "@/lib/active-legal-entity-storage";
import { setGuestMode } from "@/lib/guest-mode";
import { clearPasswordHistory } from "@/lib/password-history-storage";
import { clearAppQueryCache } from "@/lib/query-client";
import { resetStackTo } from "@/lib/reset-navigation";
import {
  clearSessionToken,
  getSessionToken,
} from "@/lib/session-token-storage";
import { clearSessionUserProfile } from "@/lib/session-user-profile-storage";

export async function signOut(): Promise<void> {
  // Invalidate the session server-side (PEN073 F-12). Read the token first and
  // hand it to logoutSession, since we clear local storage below and the
  // request interceptor would otherwise race the delete. Fire-and-forget: a
  // slow or failed logout must never block the user from signing out locally.
  const token = await getSessionToken();
  if (token) {
    logoutSession(token).catch(() => undefined);
  }

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
