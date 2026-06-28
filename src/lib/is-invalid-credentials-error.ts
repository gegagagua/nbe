import { isAxiosError } from 'axios';

/**
 * True only when a login failure means the credentials themselves are wrong
 * (HTTP 401) — i.e. it is safe to forget a saved Face ID login.
 *
 * Transient failures (network errors, 423/429 lockouts, 5xx server errors)
 * return false: the saved credentials may still be valid, so Face ID must be
 * kept so the button keeps showing and the user can retry.
 */
export function isInvalidCredentialsError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return error.response?.status === 401;
}
