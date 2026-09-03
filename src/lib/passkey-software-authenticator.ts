import { p256 } from '@noble/curves/nist';
import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex, concatBytes, hexToBytes, utf8ToBytes } from '@noble/hashes/utils';
import * as Crypto from 'expo-crypto';

import { authenticateBiometric } from '@/lib/biometric-auth';
import {
  getSoftwarePasskey,
  setSoftwarePasskey,
  type SoftwarePasskeyRecord,
} from '@/lib/passkey-storage';
import type {
  PasskeyAuthenticationCredential,
  PasskeyRegistrationCredential,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@/types/passkey';

// ── Why this exists ──────────────────────────────────────────────────────────
// `react-native-passkeys` needs a native module, so it is absent in Expo Go (and
// on any binary not rebuilt with it). Rather than disable device-trust there,
// this module is a pure-JS WebAuthn authenticator: it mints a P-256 credential,
// signs the challenges itself, and returns the exact `create()` / `get()` result
// shapes the OS module would — so the same backend flow works unchanged. It is a
// software key (no Secure Enclave), intended for development/testing on Expo Go;
// real builds keep using the OS authenticator.

// COSE / WebAuthn constants.
const COSE_KTY_EC2 = 2;
const COSE_ALG_ES256 = -7;
const COSE_CRV_P256 = 1;

// Authenticator data flag bits.
const FLAG_UP = 0x01; // user present
const FLAG_UV = 0x04; // user verified
const FLAG_AT = 0x40; // attested credential data included

const AAGUID = new Uint8Array(16); // all-zero: an anonymous software authenticator

// ── Base64URL (unpadded) ──────────────────────────────────────────────────────
const B64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function bytesToB64url(bytes: Uint8Array): string {
  let out = '';
  let i = 0;
  for (; i + 3 <= bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out += B64URL[(n >> 18) & 63] + B64URL[(n >> 12) & 63] + B64URL[(n >> 6) & 63] + B64URL[n & 63];
  }
  const rem = bytes.length - i;
  if (rem === 1) {
    const n = bytes[i] << 16;
    out += B64URL[(n >> 18) & 63] + B64URL[(n >> 12) & 63];
  } else if (rem === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
    out += B64URL[(n >> 18) & 63] + B64URL[(n >> 12) & 63] + B64URL[(n >> 6) & 63];
  }
  return out;
}

// ── Minimal CBOR encoder (only the subset attestation objects need) ───────────
type CborValue = number | Uint8Array | string | CborMap;
type CborMap = { __cborMap: [CborValue, CborValue][] };

function cborMap(pairs: [CborValue, CborValue][]): CborMap {
  return { __cborMap: pairs };
}

function cborHead(major: number, n: number): number[] {
  const mt = major << 5;
  if (n < 24) return [mt | n];
  if (n < 0x100) return [mt | 24, n];
  if (n < 0x10000) return [mt | 25, (n >> 8) & 0xff, n & 0xff];
  return [mt | 26, (n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function cborEncode(value: CborValue): Uint8Array {
  if (typeof value === 'number') {
    if (!Number.isInteger(value)) throw new Error('cbor: non-integer number');
    return value >= 0
      ? new Uint8Array(cborHead(0, value))
      : new Uint8Array(cborHead(1, -1 - value));
  }
  if (value instanceof Uint8Array) {
    return concatBytes(new Uint8Array(cborHead(2, value.length)), value);
  }
  if (typeof value === 'string') {
    const bytes = utf8ToBytes(value);
    return concatBytes(new Uint8Array(cborHead(3, bytes.length)), bytes);
  }
  const pairs = value.__cborMap;
  let out: Uint8Array = new Uint8Array(cborHead(5, pairs.length));
  for (const [k, v] of pairs) {
    out = concatBytes(out, cborEncode(k), cborEncode(v));
  }
  return out;
}

// ── Key + signing helpers ─────────────────────────────────────────────────────

/** Random 32-byte P-256 scalar, rejecting the negligible out-of-range draws. */
function generatePrivateKey(): Uint8Array {
  for (let i = 0; i < 16; i += 1) {
    const candidate = Crypto.getRandomBytes(32);
    try {
      p256.getPublicKey(candidate, false);
      return candidate;
    } catch {
      // scalar was 0 or >= n; draw again
    }
  }
  throw new Error('software passkey: could not generate a valid key');
}

/** COSE_Key (CTAP2 canonical order) for an EC2 P-256 public key. */
function coseKeyFromPublicKey(publicKey: Uint8Array): Uint8Array {
  // Uncompressed point: 0x04 || X(32) || Y(32).
  const x = publicKey.slice(1, 33);
  const y = publicKey.slice(33, 65);
  return cborEncode(
    cborMap([
      [1, COSE_KTY_EC2], // kty
      [3, COSE_ALG_ES256], // alg
      [-1, COSE_CRV_P256], // crv
      [-2, x], // x
      [-3, y], // y
    ]),
  );
}

function authenticatorData(
  rpId: string,
  flags: number,
  counter: number,
  attestedCredentialData?: Uint8Array,
): Uint8Array {
  const rpIdHash = sha256(utf8ToBytes(rpId));
  const meta = new Uint8Array(5);
  meta[0] = flags;
  meta[1] = (counter >>> 24) & 0xff;
  meta[2] = (counter >>> 16) & 0xff;
  meta[3] = (counter >>> 8) & 0xff;
  meta[4] = counter & 0xff;
  return attestedCredentialData
    ? concatBytes(rpIdHash, meta, attestedCredentialData)
    : concatBytes(rpIdHash, meta);
}

/** ECDSA-P256/SHA-256 over authData || SHA-256(clientDataJSON), DER-encoded. */
function signAssertion(
  authData: Uint8Array,
  clientDataJSON: Uint8Array,
  privateKey: Uint8Array,
): Uint8Array {
  const message = concatBytes(authData, sha256(clientDataJSON));
  const digest = sha256(message);
  return p256.sign(digest, privateKey, { prehash: false }).toDERRawBytes();
}

function clientDataJSON(type: 'webauthn.create' | 'webauthn.get', challenge: string, origin: string): Uint8Array {
  // The RP hashes these exact bytes, so field order is irrelevant to the
  // signature; it only reads the values. `challenge` is already Base64URL.
  const json = JSON.stringify({ type, challenge, origin, crossOrigin: false });
  return utf8ToBytes(json);
}

// The OS platform authenticator's origin is the RP's https domain; mirror that
// so backend origin checks pass.
function originFor(rpId: string): string {
  return `https://${rpId}`;
}

/**
 * MANDATORY user-verification gate. A real OS passkey ceremony always performs
 * user verification, so this fallback must too. It uses Face ID / fingerprint
 * when enrolled and falls back to the device passcode/PIN otherwise, so it can't
 * be set up (or used) on a device with no secure lock at all. Throws a typed
 * error the service maps to a user-facing reason — `BiometricUnavailable` when
 * there's no secure lock (→ "unsupported"), `UserCancelled` on decline.
 */
async function requireUserVerification(promptMessage: string): Promise<void> {
  const result = await authenticateBiometric(promptMessage);
  if (result.success) return;
  const error = new Error(`biometric verification failed: ${result.reason}`);
  error.name =
    result.reason === 'cancelled'
      ? 'UserCancelled'
      : result.reason === 'unavailable' || result.reason === 'not_enrolled'
        ? 'BiometricUnavailable'
        : 'BiometricFailed';
  throw error;
}

// ── Public API (mirrors the react-native-passkeys native module) ──────────────

async function create(
  options: PublicKeyCredentialCreationOptionsJSON,
): Promise<PasskeyRegistrationCredential> {
  await requireUserVerification('გასანდოება');

  const rpId = options.rp.id;
  const privateKey = generatePrivateKey();
  const publicKey = p256.getPublicKey(privateKey, false);

  const credentialIdBytes = Crypto.getRandomBytes(32);
  const credentialId = bytesToB64url(credentialIdBytes);

  const coseKey = coseKeyFromPublicKey(publicKey);
  const credIdLen = new Uint8Array([
    (credentialIdBytes.length >> 8) & 0xff,
    credentialIdBytes.length & 0xff,
  ]);
  const attestedCredentialData = concatBytes(AAGUID, credIdLen, credentialIdBytes, coseKey);
  const authData = authenticatorData(rpId, FLAG_UP | FLAG_UV | FLAG_AT, 0, attestedCredentialData);

  // "none" attestation — the same format Apple/Google platform passkeys use.
  const attestationObject = cborEncode(
    cborMap([
      ['fmt', 'none'],
      ['attStmt', cborMap([])],
      ['authData', authData],
    ]),
  );

  const record: SoftwarePasskeyRecord = {
    privHex: bytesToHex(privateKey),
    userHandle: options.user?.id ?? null,
    counter: 0,
  };
  await setSoftwarePasskey(credentialId, record);

  const clientData = clientDataJSON('webauthn.create', options.challenge, originFor(rpId));

  return {
    id: credentialId,
    rawId: credentialId,
    type: 'public-key',
    authenticatorAttachment: 'platform',
    response: {
      clientDataJSON: bytesToB64url(clientData),
      attestationObject: bytesToB64url(attestationObject),
      transports: ['internal'],
    },
    clientExtensionResults: {},
  };
}

async function get(
  options: PublicKeyCredentialRequestOptionsJSON,
): Promise<PasskeyAuthenticationCredential> {
  const rpId = options.rpId ?? '';
  const allowed = options.allowCredentials ?? [];
  if (!rpId) throw new Error('software passkey: missing rpId in request options');

  // Find the stored key for one of the allowed credentials.
  let credentialId: string | null = null;
  let record: SoftwarePasskeyRecord | null = null;
  for (const descriptor of allowed) {
    const found = await getSoftwarePasskey(descriptor.id);
    if (found) {
      credentialId = descriptor.id;
      record = found;
      break;
    }
  }
  if (!credentialId || !record) {
    const error = new Error('software passkey: no matching credential on device');
    error.name = 'NoCredential';
    throw error;
  }

  await requireUserVerification('შესვლა Passkey-ით');

  const counter = record.counter + 1;
  const authData = authenticatorData(rpId, FLAG_UP | FLAG_UV, counter);
  const clientData = clientDataJSON('webauthn.get', options.challenge, originFor(rpId));

  const signature = signAssertion(authData, clientData, hexToBytes(record.privHex));
  await setSoftwarePasskey(credentialId, { ...record, counter });

  return {
    id: credentialId,
    rawId: credentialId,
    type: 'public-key',
    authenticatorAttachment: 'platform',
    response: {
      clientDataJSON: bytesToB64url(clientData),
      authenticatorData: bytesToB64url(authData),
      signature: bytesToB64url(signature),
      userHandle: record.userHandle,
    },
    clientExtensionResults: {},
  };
}

export const softwarePasskeyAuthenticator = {
  isSupported: () => true,
  create,
  get,
};
