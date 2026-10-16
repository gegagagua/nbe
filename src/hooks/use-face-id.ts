import { useCallback, useEffect, useState } from 'react';

import { getBiometricAvailability } from '@/lib/biometric-auth';
import { loadFaceIdState } from '@/lib/face-id-state';
import {
  clearFaceIdAll,
  getFaceIdCredentials,
  getFaceIdEnabled,
  setFaceIdCredentials,
  setFaceIdEnabled,
} from '@/lib/face-id-storage';
import type {
  BiometricAvailability,
  BiometryKind,
  FaceIdCredentials,
} from '@/types/face-id';

// Classify an error thrown by the biometric-gated SecureStore read/write
// (PEN073 F-3/F-4) so the UI can tell a user cancellation apart from a genuine
// failure. The OS now enforces the gate, so these are the only outcomes left.
function classifyStoreAuthError(
  error: unknown,
): 'cancelled' | 'invalidated' | 'failed' {
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
  // AndroidKeyStore invalidates the key when the enrolled biometric set changes;
  // the stored secret is unrecoverable and Face ID must be set up again.
  if (message.includes('invalidat') || message.includes('key permanently')) {
    return 'invalidated';
  }
  if (
    message.includes('cancel') ||
    message.includes('user_cancel') ||
    message.includes('user canceled') ||
    message.includes('authentication canceled')
  ) {
    return 'cancelled';
  }
  return 'failed';
}

type EnableArgs = {
  username: string;
  password: string;
  promptMessage: string;
};

type UseFaceIdState = {
  isLoading: boolean;
  availability: BiometricAvailability;
  isEnabled: boolean;
  hasCredentials: boolean;
  kind: BiometryKind;
  refresh: () => Promise<void>;
  enable: (args: EnableArgs) => Promise<
    | { ok: true }
    | { ok: false; reason: 'cancelled' | 'failed' | 'unavailable' | 'not_enrolled' }
  >;
  disable: () => Promise<void>;
  authenticateAndGetCredentials: (
    promptMessage: string,
  ) => Promise<
    | { ok: true; credentials: FaceIdCredentials }
    | {
        ok: false;
        reason: 'cancelled' | 'failed' | 'unavailable' | 'not_enrolled' | 'no_credentials';
      }
  >;
};

const initialAvailability: BiometricAvailability = {
  hasHardware: false,
  isEnrolled: false,
  isAvailable: false,
  hasSecureLock: false,
  kind: 'none',
};

export function useFaceId(): UseFaceIdState {
  const [isLoading, setIsLoading] = useState(true);
  const [availability, setAvailability] = useState<BiometricAvailability>(initialAvailability);
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const { availability: avail, isActive } = await loadFaceIdState();
      setAvailability(avail);
      setIsEnabled(isActive);
      setHasCredentials(isActive);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const enable = useCallback<UseFaceIdState['enable']>(
    async ({ username, password, promptMessage }) => {
      // Pre-check availability so we can return precise reasons; the real gate
      // is the hardware-backed SecureStore write below, which prompts for the
      // device biometric/credential (PEN073 F-4: no bypassable JS-only check).
      const availability = await getBiometricAvailability();
      if (!availability.hasSecureLock) {
        return {
          ok: false,
          reason: availability.hasHardware ? 'not_enrolled' : 'unavailable',
        };
      }
      try {
        // Write the gated credentials FIRST, then set the flag — the flag is the
        // source of truth (loadFaceIdState) and must only be set once the secret
        // is durably stored, so a partial write can't leave a dangling flag.
        await setFaceIdCredentials(
          { username: username.trim(), password },
          promptMessage,
        );
      } catch (error) {
        return {
          ok: false,
          reason: classifyStoreAuthError(error) === 'cancelled' ? 'cancelled' : 'failed',
        };
      }
      await setFaceIdEnabled(true);
      setIsEnabled(true);
      setHasCredentials(true);
      return { ok: true };
    },
    [],
  );

  const disable = useCallback(async () => {
    await clearFaceIdAll();
    setIsEnabled(false);
    setHasCredentials(false);
  }, []);

  const authenticateAndGetCredentials = useCallback<
    UseFaceIdState['authenticateAndGetCredentials']
  >(async (promptMessage) => {
    // Auth-free existence check (no prompt) before we touch the gated secret.
    const enabled = await getFaceIdEnabled();
    if (!enabled) {
      return { ok: false, reason: 'no_credentials' };
    }
    try {
      // The read itself triggers the hardware biometric/credential prompt
      // (PEN073 F-4). There is no separate JS gate to bypass: without a
      // successful OS authentication this throws and no plaintext is returned.
      const stored = await getFaceIdCredentials(promptMessage);
      if (!stored) {
        // Flag set but the secret is gone/corrupt — reconcile and ask to re-setup.
        await clearFaceIdAll();
        setIsEnabled(false);
        setHasCredentials(false);
        return { ok: false, reason: 'no_credentials' };
      }
      return { ok: true, credentials: stored };
    } catch (error) {
      const kind = classifyStoreAuthError(error);
      if (kind === 'invalidated') {
        // The key is permanently unusable (biometrics changed); drop it so the
        // user is cleanly prompted to enable Face ID again.
        await clearFaceIdAll();
        setIsEnabled(false);
        setHasCredentials(false);
        return { ok: false, reason: 'no_credentials' };
      }
      return { ok: false, reason: kind === 'cancelled' ? 'cancelled' : 'failed' };
    }
  }, []);

  return {
    isLoading,
    availability,
    isEnabled,
    hasCredentials,
    kind: availability.kind,
    refresh,
    enable,
    disable,
    authenticateAndGetCredentials,
  };
}
