export type FaceIdCredentials = {
  username: string;
  password: string;
};

export type BiometryKind = 'faceId' | 'fingerprint' | 'iris' | 'unknown' | 'none';

export type BiometricAvailability = {
  hasHardware: boolean;
  isEnrolled: boolean;
  isAvailable: boolean;
  kind: BiometryKind;
};

export type BiometricAuthResult =
  | { success: true }
  | { success: false; reason: 'cancelled' | 'failed' | 'unavailable' | 'not_enrolled' };
