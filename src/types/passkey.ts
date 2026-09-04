import type { CreateSessionResponse } from '@/types/session';

// ── WebAuthn JSON options (as returned by the backend challenge endpoints) ─────
// These mirror the W3C `PublicKeyCredential*OptionsJSON` shapes. Binary members
// (challenge, ids) are Base64URL strings, exactly what the native passkey API
// consumes — so backend options are passed through to it untouched.

export type PublicKeyCredentialDescriptorJSON = {
  type: string;
  id: string;
  transports?: string[];
};

export type PublicKeyCredentialCreationOptionsJSON = {
  rp: { id: string; name: string };
  user: { id: string; name: string; displayName: string };
  challenge: string;
  pubKeyCredParams: { type: string; alg: number }[];
  timeout?: number;
  excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
  authenticatorSelection?: Record<string, unknown>;
  attestation?: string;
  extensions?: Record<string, unknown>;
};

export type PublicKeyCredentialRequestOptionsJSON = {
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: PublicKeyCredentialDescriptorJSON[];
  userVerification?: string;
  extensions?: Record<string, unknown>;
};

// ── Credentials produced by the native OS / credential provider ───────────────
// The app never hand-builds these — they come straight from react-native-passkeys
// (`create()` / `get()`) and are forwarded verbatim to the backend.

export type PasskeyRegistrationCredential = {
  id: string;
  rawId: string;
  type: string;
  authenticatorAttachment?: string | null;
  response: {
    clientDataJSON: string;
    attestationObject: string;
    transports?: string[];
    [key: string]: unknown;
  };
  clientExtensionResults?: Record<string, unknown>;
  [key: string]: unknown;
};

export type PasskeyAuthenticationCredential = {
  id: string;
  rawId: string;
  type: string;
  authenticatorAttachment?: string | null;
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle?: string | null;
    [key: string]: unknown;
  };
  clientExtensionResults?: Record<string, unknown>;
  [key: string]: unknown;
};

// ── Challenge responses ───────────────────────────────────────────────────────

export type RegistrationChallenge = {
  challengeId: number;
  expiresDate: string;
  creationOptions: PublicKeyCredentialCreationOptionsJSON;
  requestOptions: null;
};

export type LoginChallenge = {
  challengeId: number;
  expiresDate: string;
  creationOptions: null;
  requestOptions: PublicKeyCredentialRequestOptionsJSON;
};

// ── Register / login request + response bodies ────────────────────────────────

export type DeviceTrustPlatform = 'ANDROID' | 'IOS' | 'WEB';

export type RegisterPasskeyRequest = {
  challengeId: number;
  installationId: string;
  deviceName: string;
  platform: DeviceTrustPlatform;
  appVersion: string;
  label: string;
  credential: PasskeyRegistrationCredential;
};

export type RegisterPasskeyResponse = {
  credentialId: string;
};

export type LoginPasskeyRequest = {
  challengeId: number;
  credential: PasskeyAuthenticationCredential;
};

// The passkey login endpoint returns the same session envelope as a normal login.
export type PasskeyLoginResponse = CreateSessionResponse;

// A trusted device/credential as listed by GET /webauthn/credentials. The exact
// DTO is still being finalised backend-side, so extra fields are tolerated.
export type TrustedCredential = {
  // Server-side record id — this is what DELETE /webauthn/credential/{id} expects,
  // distinct from the Base64URL `credentialId` used by the WebAuthn login flow.
  id?: string | number;
  credentialId: string;
  installationId?: string;
  deviceName?: string;
  label?: string;
  platform?: string;
  appVersion?: string;
  createdDate?: string;
  revokedDate?: string | null;
  [key: string]: unknown;
};

// ── Result unions surfaced to the UI ──────────────────────────────────────────

export type RegisterDeviceResult =
  | { ok: true; credentialId: string }
  | {
      ok: false;
      reason: 'unsupported' | 'cancelled' | 'already-registered' | 'error';
      // Message returned by the backend, when it carries a user-facing one
      // (currently used for the 'already-registered' 409).
      message?: string;
      error?: unknown;
    };

export type PasskeyLoginResult =
  | { ok: true; session: CreateSessionResponse }
  | {
      ok: false;
      reason: 'unsupported' | 'no_credential' | 'cancelled' | 'error';
      error?: unknown;
    };
