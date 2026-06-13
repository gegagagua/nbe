import { useEffect, useState } from 'react';

import { getSessionUserProfile } from '@/lib/session-user-profile-storage';

export function useDebtorExtractApplicant() {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    let active = true;
    getSessionUserProfile().then((profile) => {
      if (!active || !profile) {
        return;
      }
      const name = `${profile.firstName} ${profile.lastName}`.trim();
      if (name) {
        setFullName(name);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { fullName, personalId: '' };
}
