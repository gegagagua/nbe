import { useCallback, useEffect, useState } from "react";

import { getUserMe } from "@/api/users";
import i18n from "@/i18n/i18n";
import { isGuestMode } from "@/lib/guest-mode";
import {
  getSessionUserProfile,
  setSessionUserProfile,
} from "@/lib/session-user-profile-storage";
import type { SessionUserProfileBrief } from "@/types/session";

function deriveDisplayName(p: SessionUserProfileBrief | null): string {
  if (!p) return i18n.t("home.userFallback");
  const name = `${p.firstName} ${p.lastName}`.trim();
  return name || p.username.trim() || i18n.t("home.userFallback");
}

// Passkey logins (the usual iOS path) return a session user without
// firstName/lastName, which left the header showing the personal number
// instead of the name. When the stored profile has no name, pull it from
// /users/me once and persist it.
async function backfillProfileName(
  p: SessionUserProfileBrief,
): Promise<SessionUserProfileBrief | null> {
  try {
    const me = await getUserMe();
    const firstName = me.firstName ?? "";
    const lastName = me.lastName ?? "";
    if (!`${firstName}${lastName}`.trim()) return null;
    const next: SessionUserProfileBrief = { ...p, firstName, lastName };
    await setSessionUserProfile(next);
    return next;
  } catch {
    return null;
  }
}

export function useSessionUserProfile() {
  const [displayName, setDisplayName] = useState<string>(() =>
    i18n.t("home.userFallback"),
  );
  const [profile, setProfile] = useState<SessionUserProfileBrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSessionUserProfile().then(async (p) => {
      if (!active) return;
      setProfile(p);
      setIsLoading(false);
      setDisplayName(deriveDisplayName(p));
      if (p && !`${p.firstName}${p.lastName}`.trim() && !isGuestMode()) {
        const next = await backfillProfileName(p);
        if (next && active) {
          setProfile(next);
          setDisplayName(deriveDisplayName(next));
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onLang = () => {
      getSessionUserProfile().then((p) => {
        setProfile(p);
        setDisplayName(deriveDisplayName(p));
      });
    };
    i18n.on("languageChanged", onLang);
    return () => {
      i18n.off("languageChanged", onLang);
    };
  }, []);

  const updateProfile = useCallback((next: SessionUserProfileBrief) => {
    setProfile(next);
    setDisplayName(deriveDisplayName(next));
  }, []);

  return { displayName, profile, isLoading, updateProfile };
}
