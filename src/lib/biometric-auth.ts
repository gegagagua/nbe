import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

import type {
  BiometricAuthResult,
  BiometricAvailability,
  BiometryKind,
} from '@/types/face-id';

function mapKind(types: LocalAuthentication.AuthenticationType[]): BiometryKind {
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return 'faceId';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return 'fingerprint';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return 'iris';
  }
  return 'unknown';
}

export async function getBiometricAvailability(): Promise<BiometricAvailability> {
  if (Platform.OS === 'web') {
    return {
      hasHardware: false,
      isEnrolled: false,
      isAvailable: false,
      hasSecureLock: false,
      kind: 'none',
    };
  }
  try {
    const [hasHardware, isEnrolled, types, enrolledLevel] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync(),
      LocalAuthentication.getEnrolledLevelAsync(),
    ]);
    return {
      hasHardware,
      isEnrolled,
      isAvailable: hasHardware && isEnrolled,
      // Any lock above NONE (SECRET = passcode/PIN/pattern, or biometric) means
      // the device can authenticate via the passcode fallback.
      hasSecureLock: enrolledLevel !== LocalAuthentication.SecurityLevel.NONE,
      kind: hasHardware ? mapKind(types) : 'none',
    };
  } catch {
    return {
      hasHardware: false,
      isEnrolled: false,
      isAvailable: false,
      hasSecureLock: false,
      kind: 'none',
    };
  }
}

export async function authenticateBiometric(promptMessage: string): Promise<BiometricAuthResult> {
  if (Platform.OS === 'web') {
    return { success: false, reason: 'unavailable' };
  }
  const availability = await getBiometricAvailability();
  // `disableDeviceFallback: false` lets a passcode-only device verify, so we only
  // hard-fail when there's no secure lock at all — nothing to authenticate against.
  if (!availability.hasSecureLock) {
    return { success: false, reason: availability.hasHardware ? 'not_enrolled' : 'unavailable' };
  }
  try {
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage,
      disableDeviceFallback: false,
      cancelLabel: undefined,
    });
    if (res.success) {
      return { success: true };
    }
    if (res.error === 'user_cancel' || res.error === 'app_cancel' || res.error === 'system_cancel') {
      return { success: false, reason: 'cancelled' };
    }
    return { success: false, reason: 'failed' };
  } catch {
    return { success: false, reason: 'failed' };
  }
}
