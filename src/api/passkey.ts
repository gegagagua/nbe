import { ApiPaths, BASE_URL } from '@/constants/api';
import { apiClient } from '@/lib/api-client';
import type {
  LoginChallenge,
  LoginPasskeyRequest,
  PasskeyLoginResponse,
  RegisterPasskeyRequest,
  RegisterPasskeyResponse,
  RegistrationChallenge,
  TrustedCredential,
} from '@/types/passkey';
import type { CreateSessionApiEnvelope } from '@/types/session';

type Envelope<T> = { data: T };

/**
 * Start a device-trust / passkey registration. Authenticated — the gateway ties
 * the challenge to the current session user. Body is empty by design.
 */
export async function requestRegistrationChallenge(): Promise<RegistrationChallenge> {
  const res = await apiClient.post<Envelope<RegistrationChallenge>>(
    `${BASE_URL}${ApiPaths.webauthnChallenge}`,
  );
  return res.data.data;
}

/** Finish registration by sending the OS-produced attestation credential. */
export async function registerPasskey(
  payload: RegisterPasskeyRequest,
): Promise<RegisterPasskeyResponse> {
  const res = await apiClient.post<Envelope<RegisterPasskeyResponse>>(
    `${BASE_URL}${ApiPaths.webauthnRegister}`,
    { data: payload },
  );
  return res.data.data;
}

/**
 * Start a passkey login. Public — runs before a session exists — and is scoped
 * to the credential registered on this device.
 */
export async function requestLoginChallenge(
  credentialId: string,
): Promise<LoginChallenge> {
  const res = await apiClient.post<Envelope<LoginChallenge>>(
    `${BASE_URL}${ApiPaths.webauthnLoginChallenge}`,
    { data: { credentialId } },
  );
  return res.data.data;
}

/** Finish login with the OS-produced assertion; returns a normal session. */
export async function loginPasskey(
  payload: LoginPasskeyRequest,
): Promise<PasskeyLoginResponse> {
  const res = await apiClient.post<CreateSessionApiEnvelope>(
    `${BASE_URL}${ApiPaths.webauthnLogin}`,
    { data: payload },
  );
  return res.data.data;
}

/** The current user's active trusted devices/credentials. */
export async function listTrustedCredentials(): Promise<TrustedCredential[]> {
  const res = await apiClient.get<Envelope<TrustedCredential[]>>(
    `${BASE_URL}${ApiPaths.webauthnCredentials}`,
  );
  return res.data.data ?? [];
}

/**
 * Revoke a trusted credential server-side (sets revokedDate). After this the
 * credential can no longer start a passkey login, so the app clears its local
 * reference too.
 */
export async function revokeCredential(credentialId: string): Promise<void> {
  await apiClient.delete(
    `${BASE_URL}${ApiPaths.webauthnCredentialById(credentialId)}`,
  );
}
