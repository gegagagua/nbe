import { router } from 'expo-router';
import { useEffect, useState } from 'react';

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
        router.replace('/home');
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
      if (!token) {
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
