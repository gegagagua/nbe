import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { isGuestMode } from '@/lib/guest-mode';
import { getSessionToken } from '@/lib/session-token-storage';

export function useLoginIndexSessionRedirect() {
  const [canShowLogin, setCanShowLogin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const token = await getSessionToken();
      if (cancelled) {
        return;
      }
      if (token) {
        router.replace('/dashboard');
        return;
      }
      setCanShowLogin(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return canShowLogin;
}

export function useHomeRouteSessionGuard() {
  const [canShowHome, setCanShowHome] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const token = await getSessionToken();
      if (cancelled) {
        return;
      }
      if (!token && !isGuestMode()) {
        router.replace('/');
        return;
      }
      setCanShowHome(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return canShowHome;
}
