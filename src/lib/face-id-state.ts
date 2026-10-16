import { getBiometricAvailability } from '@/lib/biometric-auth';
import { getFaceIdEnabled } from '@/lib/face-id-storage';
import type { BiometricAvailability } from '@/types/face-id';

export async function loadFaceIdState(): Promise<{
  availability: BiometricAvailability;
  isActive: boolean;
}> {
  // The `enabled` flag is the auth-free source of truth for whether Face ID is
  // set up. We deliberately do NOT read the credentials here: since PEN073
  // F-3/F-4 the credential item is biometric-gated, so reading it would trigger
  // an OS auth prompt on every app launch / profile open. enable() only sets
  // the flag AFTER the gated credential write succeeds, and disable()/
  // clearFaceIdAll() wipe both together, so the flag reliably implies a stored
  // secret. A stale flag with no readable secret is reconciled at login time
  // (authenticateAndGetCredentials clears both and reports no_credentials).
  const [availability, enabled] = await Promise.all([
    getBiometricAvailability(),
    getFaceIdEnabled(),
  ]);

  return { availability, isActive: enabled };
}
