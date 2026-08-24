import { useCallback, useEffect, useState } from 'react';

import { revokeCredential } from '@/api/passkey';
import { clearPasskeyCredentialId, getPasskeyCredentialId } from '@/lib/passkey-storage';
import {
  isPasskeySupported,
  loginWithPasskey,
  registerDevicePasskey,
} from '@/lib/passkey-service';
import type { PasskeyLoginResult, RegisterDeviceResult } from '@/types/passkey';

/**
 * Device-trust (passkey) state + actions, shared by the profile screen (register
 * / forget) and the login screen (sign in with passkey). Mirrors the shape of
 * `useFaceId` so the two security features read the same way.
 */
export function useDeviceTrust() {
  const [isSupported] = useState<boolean>(() => isPasskeySupported());
  const [isTrusted, setIsTrusted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  const refresh = useCallback(async () => {
    const credentialId = await getPasskeyCredentialId();
    setIsTrusted(!!credentialId);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const register = useCallback(
    async (label: string): Promise<RegisterDeviceResult> => {
      setIsBusy(true);
      try {
        const result = await registerDevicePasskey(label);
        if (result.ok) setIsTrusted(true);
        return result;
      } finally {
        setIsBusy(false);
      }
    },
    [],
  );

  const login = useCallback(async (): Promise<PasskeyLoginResult> => {
    setIsBusy(true);
    try {
      return await loginWithPasskey();
    } finally {
      setIsBusy(false);
    }
  }, []);

  // Local-only cleanup — used when the credential is already gone server-side
  // (e.g. the OS passkey was deleted), or from the login screen where there's no
  // session to authorise a backend revoke.
  const forgetLocal = useCallback(async () => {
    setIsBusy(true);
    try {
      await clearPasskeyCredentialId();
      setIsTrusted(false);
    } finally {
      setIsBusy(false);
    }
  }, []);

  // Full "remove trusted device": revoke on the backend first (so the credential
  // stops being accepted), then drop the local reference. Local cleanup only
  // runs on a successful revoke.
  const revokeDevice = useCallback(async (): Promise<
    { ok: true } | { ok: false; error: unknown }
  > => {
    setIsBusy(true);
    try {
      const credentialId = await getPasskeyCredentialId();
      if (credentialId) await revokeCredential(credentialId);
      await clearPasskeyCredentialId();
      setIsTrusted(false);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    } finally {
      setIsBusy(false);
    }
  }, []);

  return {
    isSupported,
    isTrusted,
    isLoading,
    isBusy,
    refresh,
    register,
    login,
    forgetLocal,
    revokeDevice,
  };
}
