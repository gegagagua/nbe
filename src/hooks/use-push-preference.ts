import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { setPushPreference } from '@/api/notifications';
import { getOrCreateInstallationId } from '@/lib/passkey-storage';
import { getPushEnabled, setPushEnabled } from '@/lib/push-preference-storage';
import { syncPushDeviceRegistration } from '@/lib/push-notifications';

export type PushPreferenceResult =
  | { ok: true }
  | { ok: false; reason: 'unavailable' | 'failed' };

/**
 * Push on/off state for the current user on this installation, synced with
 * `PUT /notif-portal/v1/push-notifications/preference`.
 */
export function usePushPreference(userId: number | null | undefined) {
  const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getPushEnabled(userId).then((enabled) => {
      if (cancelled) return;
      setIsEnabled(enabled);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggle = useCallback(
    async (next: boolean): Promise<PushPreferenceResult> => {
      if (!userId || !isSupported) return { ok: false, reason: 'unavailable' };
      setIsBusy(true);
      try {
        if (next && !(await syncPushDeviceRegistration(userId))) {
          return { ok: false, reason: 'unavailable' };
        }
        await setPushPreference(userId, await getOrCreateInstallationId(), next);
        await setPushEnabled(userId, next);
        setIsEnabled(next);
        return { ok: true };
      } catch {
        return { ok: false, reason: 'failed' };
      } finally {
        setIsBusy(false);
      }
    },
    [userId, isSupported],
  );

  return {
    isSupported,
    isEnabled,
    isLoading: !!userId && isLoading,
    isBusy,
    toggle,
  };
}
