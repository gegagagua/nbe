import { useEffect, useState } from 'react';

import { HomeDashboardCopy } from '@/constants/home-dashboard-copy';
import { getSessionUserProfile } from '@/lib/session-user-profile-storage';

export function useSessionUserProfile() {
  const [displayName, setDisplayName] = useState<string>(HomeDashboardCopy.userFallback);

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

  return { displayName };
}
