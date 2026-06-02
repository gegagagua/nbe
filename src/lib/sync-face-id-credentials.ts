import { getFaceIdEnabled, setFaceIdCredentials } from '@/lib/face-id-storage';
import type { FaceIdCredentials } from '@/types/face-id';

export async function syncFaceIdCredentialsIfEnabled(
  credentials: FaceIdCredentials,
): Promise<void> {
  if (!(await getFaceIdEnabled())) return;
  await setFaceIdCredentials({
    username: credentials.username.trim(),
    password: credentials.password,
  });
}
