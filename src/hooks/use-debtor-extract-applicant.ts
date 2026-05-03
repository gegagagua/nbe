import { useEffect, useState } from 'react';

import { DebtorExtractMockApplicant } from '@/constants/debtor-extract-mock';
import { getSessionUserProfile } from '@/lib/session-user-profile-storage';

export function useDebtorExtractApplicant() {
  const [fullName, setFullName] = useState(
    `${DebtorExtractMockApplicant.firstName} ${DebtorExtractMockApplicant.lastName}`.trim(),
  );
  const personalId = DebtorExtractMockApplicant.personalId;

  useEffect(() => {
    let active = true;
    void getSessionUserProfile().then((profile) => {
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

  return { fullName, personalId };
}
