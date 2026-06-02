import { createSession } from '@/api/sessions';

export async function verifyUserPassword(
  username: string,
  password: string,
): Promise<boolean> {
  try {
    await createSession({ username: username.trim(), password });
    return true;
  } catch {
    return false;
  }
}
