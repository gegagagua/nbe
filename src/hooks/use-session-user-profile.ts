import { useEffect, useState } from 'react';

import i18n from '@/i18n/i18n';
import { getSessionUserProfile } from '@/lib/session-user-profile-storage';

export function useSessionUserProfile() {
  const [displayName, setDisplayName] = useState<string>(() =>
    i18n.t('home.userFallback'),
  );

  useEffect(() => {
    let active = true;
    void getSessionUserProfile().then((profile) => {
      if (!active || !profile) {
        return;
      }
      const name = `${profile.firstName} ${profile.lastName}`.trim();
      if (name) {
        setDisplayName(name);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onLang = () => {
      void getSessionUserProfile().then((profile) => {
        const name = profile
          ? `${profile.firstName} ${profile.lastName}`.trim()
          : '';
        setDisplayName(name || i18n.t('home.userFallback'));
      });
    };
    i18n.on('languageChanged', onLang);
    return () => {
      i18n.off('languageChanged', onLang);
    };
  }, []);

  return { displayName };
}
