import { useCallback, useEffect, useState } from "react";

import i18n from "@/i18n/i18n";
import { getSessionUserProfile } from "@/lib/session-user-profile-storage";
import type { SessionUserProfileBrief } from "@/types/session";

function deriveDisplayName(p: SessionUserProfileBrief | null): string {
  if (!p) return i18n.t("home.userFallback");
  const name = `${p.firstName} ${p.lastName}`.trim();
  return name || p.username.trim() || i18n.t("home.userFallback");
}

export function useSessionUserProfile() {
  const [displayName, setDisplayName] = useState<string>(() =>
    i18n.t("home.userFallback"),
  );
  const [profile, setProfile] = useState<SessionUserProfileBrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSessionUserProfile().then((p) => {
      console.log("p", p);
      if (!active) return;
      setProfile(p);
      setIsLoading(false);
      setDisplayName(deriveDisplayName(p));
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onLang = () => {
      getSessionUserProfile().then((p) => {
        console.log("p", p);
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
