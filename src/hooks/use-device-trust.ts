import { useCallback, useEffect, useState } from 'react';

import { listTrustedCredentials, revokeCredential } from '@/api/passkey';
import { getBiometricAvailability } from '@/lib/biometric-auth';
import { clearPasskeyCredentialId, getPasskeyCredentialId } from '@/lib/passkey-storage';
import {
  isPasskeySupported,
  loginWithPasskey,
  reconcileDeviceTrust,
  registerDevicePasskey,
} from '@/lib/passkey-service';
import type { PasskeyLoginResult, RegisterDeviceResult } from '@/types/passkey';

/**
 * Device-trust (passkey) state + actions, shared by the profile screen (register
 * / forget) and the login screen (sign in with passkey). Mirrors the shape of
 * `useFaceId` so the two security features read the same way.
 */
export function useDeviceTrust() {
  // Device trust is a secure login, so it requires a device lock (Face ID /
  // fingerprint, or a passcode/PIN via the OS fallback) — not just passkey
  // support. `requiresBiometricSetup` lets the UI tell "no screen lock yet" apart
  // from "passkeys genuinely unavailable".
  const [isSupported, setIsSupported] = useState(false);
  const [requiresBiometricSetup, setRequiresBiometricSetup] = useState(false);
  const [isTrusted, setIsTrusted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [credentialId, availability] = await Promise.all([
      getPasskeyCredentialId(),
      getBiometricAvailability(),
    ]);
    const passkeySupported = isPasskeySupported();
    setIsSupported(passkeySupported && availability.hasSecureLock);
    setRequiresBiometricSetup(passkeySupported && !availability.hasSecureLock);
    // Local credentialId first — fast, offline-capable initial state.
    setIsTrusted(!!credentialId);
    setIsLoading(false);

    // Then reconcile against the server so the switch reflects real trust state:
    // a device registered server-side but missing its local credentialId (the 409
    // case) still shows as trusted. Best-effort — if the list can't be read we
    // keep the local-derived state above.
    const server = await reconcileDeviceTrust();
    if (server === true) setIsTrusted(true);
    else if (server === false) setIsTrusted(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const register = useCallback(
    async (label: string): Promise<RegisterDeviceResult> => {
      setIsBusy(true);
      try {
        const result = await registerDevicePasskey(label);
        // 'already-registered' means the device is trusted server-side, so flip
        // the switch on too — same as a fresh success from the user's view.
        if (result.ok || result.reason === 'already-registered') setIsTrusted(true);
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

  // "Remove trusted device", frontend-first: drop the local reference and flip
  // the switch OFF immediately so the UI always reflects the user's action, then
  // best-effort the backend revoke. A backend failure (e.g. 500) no longer keeps
  // the device stuck as trusted here — it's reported as `serverSynced: false` so
  // the caller can note the server wasn't reached, but the toggle stays off.
  const revokeDevice = useCallback(async (): Promise<
    { ok: true; serverSynced: boolean; error?: unknown }
  > => {
    setIsBusy(true);
    try {
      const credentialId = await getPasskeyCredentialId();
      await clearPasskeyCredentialId();
      setIsTrusted(false);
      try {
        if (credentialId) {
          // DELETE wants the server record `id`, not the Base64URL credentialId —
          // resolve it from the trusted-credentials list before revoking.
          const list = await listTrustedCredentials();
          const match = list.find((c) => c.credentialId === credentialId);
          const id = match?.id ?? credentialId;
          await revokeCredential(id);
        }
        return { ok: true, serverSynced: true };
      } catch (error) {
        return { ok: true, serverSynced: false, error };
      }
    } finally {
      setIsBusy(false);
    }
  }, []);

  return {
    isSupported,
    requiresBiometricSetup,
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
