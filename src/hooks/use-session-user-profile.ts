import { useEffect, useState } from 'react';

import i18n from '@/i18n/i18n';
import { getSessionUserProfile } from '@/lib/session-user-profile-storage';
import type { SessionUserProfileBrief } from '@/types/session';

export function useSessionUserProfile() {
  const [displayName, setDisplayName] = useState<string>(() =>
    i18n.t('home.userFallback'),
  );
  const [profile, setProfile] = useState<SessionUserProfileBrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getSessionUserProfile().then((p) => {
      if (!active) return;
      setProfile(p);
      setIsLoading(false);
      if (p) {
        const name = `${p.firstName} ${p.lastName}`.trim();
        if (name) setDisplayName(name);
      }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const onLang = () => {
      void getSessionUserProfile().then((p) => {
        setProfile(p);
        const name = p ? `${p.firstName} ${p.lastName}`.trim() : '';
        setDisplayName(name || i18n.t('home.userFallback'));
      });
    };
    i18n.on('languageChanged', onLang);
    return () => { i18n.off('languageChanged', onLang); };
  }, []);

  return { displayName, profile, isLoading };
}
