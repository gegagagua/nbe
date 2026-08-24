import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

import type { DeviceTrustPlatform } from '@/types/passkey';

/**
 * A human/technical device name for the register payload, e.g. "iPhone 17 Pro"
 * or "Samsung Galaxy S26". Falls back to the OS-reported device name, then to a
 * generic platform label so the field is never empty.
 */
export function resolveDeviceName(): string {
  return (
    Device.modelName ??
    Device.deviceName ??
    (Platform.OS === 'ios' ? 'iPhone' : 'Android device')
  );
}

/** Backend `platform` enum. WEB is only used for web testing. */
export function resolvePlatform(): DeviceTrustPlatform {
  if (Platform.OS === 'ios') return 'IOS';
  if (Platform.OS === 'android') return 'ANDROID';
  return 'WEB';
}

/** The app's current version string, e.g. "1.0.56". */
export function resolveAppVersion(): string {
  return Constants.expoConfig?.version ?? '1.0.0';
}
