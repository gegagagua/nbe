import { getBiometricAvailability } from '@/lib/biometric-auth';
import {
  clearFaceIdCredentials,
  getFaceIdCredentials,
  getFaceIdEnabled,
  setFaceIdEnabled,
} from '@/lib/face-id-storage';
import type { BiometricAvailability } from '@/types/face-id';

export async function loadFaceIdState(): Promise<{
  availability: BiometricAvailability;
  isActive: boolean;
}> {
  const [availability, enabledFlag, creds] = await Promise.all([
    getBiometricAvailability(),
    getFaceIdEnabled(),
    getFaceIdCredentials(),
  ]);

  let enabled = enabledFlag;
  let credentials = creds;

  if (enabled && !credentials) {
    await setFaceIdEnabled(false);
    enabled = false;
  }
  if (!enabled && credentials) {
    await clearFaceIdCredentials();
    credentials = null;
  }

  return { availability, isActive: enabled && !!credentials };
}
