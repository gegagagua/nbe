import { getBiometricAvailability } from '@/lib/biometric-auth';
import {
  getFaceIdCredentials,
  getFaceIdEnabled,
  setFaceIdEnabled,
} from '@/lib/face-id-storage';
import type { BiometricAvailability } from '@/types/face-id';

export async function loadFaceIdState(): Promise<{
  availability: BiometricAvailability;
  isActive: boolean;
}> {
  const [availability, enabledFlag, credentials] = await Promise.all([
    getBiometricAvailability(),
    getFaceIdEnabled(),
    getFaceIdCredentials(),
  ]);

  // The stored credentials are the source of truth: they only exist because the
  // user enabled Face ID (enable() writes them, disable()/clearFaceIdAll() wipe
  // both keys together). If the two keys ever disagree — e.g. the `enabled`
  // flag write didn't land while the credentials did — reconcile *toward* the
  // credentials rather than deleting them, so a transient/partial write can't
  // silently wipe a working Face ID setup.
  if (credentials && !enabledFlag) {
    await setFaceIdEnabled(true);
  }
  if (!credentials && enabledFlag) {
    // No secret to authenticate with: drop the dangling flag.
    await setFaceIdEnabled(false);
  }

  return { availability, isActive: !!credentials };
}
