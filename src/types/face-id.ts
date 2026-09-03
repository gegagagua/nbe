export type FaceIdCredentials = {
  username: string;
  password: string;
};

export type BiometryKind = 'faceId' | 'fingerprint' | 'iris' | 'unknown' | 'none';

export type BiometricAvailability = {
  hasHardware: boolean;
  isEnrolled: boolean;
  isAvailable: boolean;
  // Device has *some* secure lock (biometric OR passcode/PIN/pattern). Auth runs
  // with `disableDeviceFallback: false`, so a passcode-only device can still
  // verify — this lets features that accept that fallback (device trust) gate on
  // it, while `isAvailable` stays strictly "biometric enrolled" for Face ID.
  hasSecureLock: boolean;
  kind: BiometryKind;
};

export type BiometricAuthResult =
  | { success: true }
  | { success: false; reason: 'cancelled' | 'failed' | 'unavailable' | 'not_enrolled' };
