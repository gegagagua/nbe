import { useCallback, useEffect, useState } from 'react';

import { authenticateBiometric } from '@/lib/biometric-auth';
import { loadFaceIdState } from '@/lib/face-id-state';
import {
  clearFaceIdAll,
  getFaceIdCredentials,
  setFaceIdCredentials,
  setFaceIdEnabled,
} from '@/lib/face-id-storage';
import type {
  BiometricAvailability,
  BiometryKind,
  FaceIdCredentials,
} from '@/types/face-id';

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
      const auth = await authenticateBiometric(promptMessage);
      if (!auth.success) {
        return { ok: false, reason: auth.reason };
      }
      await setFaceIdCredentials({ username: username.trim(), password });
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
    const { isActive } = await loadFaceIdState();
    if (!isActive) {
      return { ok: false, reason: 'no_credentials' };
    }
    const stored = await getFaceIdCredentials();
    if (!stored) {
      return { ok: false, reason: 'no_credentials' };
    }
    const auth = await authenticateBiometric(promptMessage);
    if (!auth.success) {
      return { ok: false, reason: auth.reason };
    }
    return { ok: true, credentials: stored };
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
