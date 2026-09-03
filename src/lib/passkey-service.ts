import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

import {
  loginPasskey,
  registerPasskey,
  requestLoginChallenge,
  requestRegistrationChallenge,
} from '@/api/passkey';
import {
  resolveAppVersion,
  resolveDeviceName,
  resolvePlatform,
} from '@/lib/device-info';
import { softwarePasskeyAuthenticator } from '@/lib/passkey-software-authenticator';
import {
  getOrCreateInstallationId,
  getPasskeyCredentialId,
  setPasskeyCredentialId,
} from '@/lib/passkey-storage';
import type {
  PasskeyAuthenticationCredential,
  PasskeyLoginResult,
  PasskeyRegistrationCredential,
  RegisterDeviceResult,
} from '@/types/passkey';

// The `react-native-passkeys` JS wrapper resolves its native module at import
// time via `requireNativeModule`, which THROWS (surfacing to LogBox) on any
// binary that wasn't rebuilt with it — an old dev client, Expo Go, or web. So we
// never import the wrapper; we grab the native module through
// `requireOptionalNativeModule`, which returns `null` instead of throwing. The
// wrapper's create/get/isSupported are thin passthroughs to these same methods.
type PasskeyNativeModule = {
  isSupported: () => boolean;
  create: (request: unknown) => Promise<unknown>;
  get: (request: unknown) => Promise<unknown>;
};

let nativeModule: PasskeyNativeModule | null | undefined;

function getPasskeyNative(): PasskeyNativeModule | null {
  if (nativeModule !== undefined) return nativeModule;
  const native =
    Platform.OS === 'web'
      ? null
      : requireOptionalNativeModule<PasskeyNativeModule>('ReactNativePasskeys');
  // No native module (Expo Go, web, or a binary not rebuilt with it) → fall back
  // to the pure-JS software authenticator so device trust still works. Real
  // dev/prod builds resolve the OS module and never touch the fallback.
  nativeModule = native ?? (softwarePasskeyAuthenticator as unknown as PasskeyNativeModule);
  return nativeModule;
}

/**
 * Whether native passkeys are usable. Web and binaries without the native module
 * are excluded — this app's device-trust flow targets native Android/iOS with a
 * dev/prod build that bundles react-native-passkeys.
 */
export function isPasskeySupported(): boolean {
  const native = getPasskeyNative();
  if (!native) return false;
  try {
    return native.isSupported();
  } catch {
    return false;
  }
}

// A `null` return from create()/get() means the user dismissed the system sheet;
// the native module also throws cancellation errors on some platforms. Treat both
// as "cancelled" rather than a hard error so the UI stays quiet.
function isUserCancellation(error: unknown): boolean {
  const message = (
    error instanceof Error ? error.message : String(error ?? '')
  ).toLowerCase();
  const name = error instanceof Error ? error.name.toLowerCase() : '';
  return (
    name.includes('cancel') ||
    message.includes('cancel') ||
    message.includes('user canceled') ||
    message.includes('aborted')
  );
}

// Biometrics not set up on the device — device trust requires Face ID /
// fingerprint, so this surfaces as "unsupported" (the OS module can't hit this;
// it comes from the software authenticator's mandatory verification gate).
function isBiometricUnavailable(error: unknown): boolean {
  return error instanceof Error && error.name === 'BiometricUnavailable';
}

/**
 * Trust this device: request a challenge, let the OS mint a passkey, register it
 * with the backend, and persist the returned credential id for future logins.
 */
export async function registerDevicePasskey(
  label: string,
): Promise<RegisterDeviceResult> {
  const native = getPasskeyNative();
  if (!native || !isPasskeySupported()) return { ok: false, reason: 'unsupported' };
  try {
    const challenge = await requestRegistrationChallenge();
    if (!challenge.creationOptions) return { ok: false, reason: 'error' };

    // The backend's creationOptions are already WebAuthn-JSON; hand them to the
    // OS verbatim (challenge/user.id must not be altered).
    const credential = (await native.create(
      challenge.creationOptions,
    )) as PasskeyRegistrationCredential | null;
    if (!credential) return { ok: false, reason: 'cancelled' };

    const deviceName = resolveDeviceName();
    const { credentialId } = await registerPasskey({
      challengeId: challenge.challengeId,
      installationId: await getOrCreateInstallationId(),
      deviceName,
      platform: resolvePlatform(),
      appVersion: resolveAppVersion(),
      label: label.trim() || deviceName,
      credential,
    });

    await setPasskeyCredentialId(credentialId);
    return { ok: true, credentialId };
  } catch (error) {
    if (isUserCancellation(error)) return { ok: false, reason: 'cancelled', error };
    if (isBiometricUnavailable(error)) return { ok: false, reason: 'unsupported', error };
    return { ok: false, reason: 'error', error };
  }
}

/**
 * Sign in with the passkey registered on this device. Returns the resulting
 * session for the caller to persist. Never throws — failures come back as a
 * typed reason.
 */
export async function loginWithPasskey(): Promise<PasskeyLoginResult> {
  const native = getPasskeyNative();
  if (!native || !isPasskeySupported()) return { ok: false, reason: 'unsupported' };
  const credentialId = await getPasskeyCredentialId();
  if (!credentialId) return { ok: false, reason: 'no_credential' };

  try {
    const challenge = await requestLoginChallenge(credentialId);
    if (!challenge.requestOptions) return { ok: false, reason: 'error' };

    const credential = (await native.get(
      challenge.requestOptions,
    )) as PasskeyAuthenticationCredential | null;
    if (!credential) return { ok: false, reason: 'cancelled' };

    const session = await loginPasskey({
      challengeId: challenge.challengeId,
      credential,
    });
    return { ok: true, session };
  } catch (error) {
    if (isUserCancellation(error)) return { ok: false, reason: 'cancelled', error };
    if (isBiometricUnavailable(error)) return { ok: false, reason: 'unsupported', error };
    return { ok: false, reason: 'error', error };
  }
}
