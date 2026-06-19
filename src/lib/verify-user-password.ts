import { createSession } from '@/api/sessions';
import type { CreateSessionResponse } from '@/types/session';

/**
 * Re-authenticates the user with their password. Returns the raw session
 * response (whose `tokenType` may be `OTP` when the account requires a
 * one-time code) or `null` when the credentials are rejected.
 */
export async function verifyUserPassword(
  username: string,
  password: string,
): Promise<CreateSessionResponse | null> {
  try {
    return await createSession({ username: username.trim(), password });
  } catch {
    return null;
  }
}
