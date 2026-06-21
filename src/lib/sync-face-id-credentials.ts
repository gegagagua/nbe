import { getFaceIdCredentials, setFaceIdCredentials } from '@/lib/face-id-storage';
import type { FaceIdCredentials } from '@/types/face-id';

export async function syncFaceIdCredentialsIfEnabled(
  credentials: FaceIdCredentials,
): Promise<void> {
  // Only refresh when Face ID is already set up. Stored credentials are the
  // source of truth (see loadFaceIdState), so gate on their presence rather
  // than the enabled flag, which may lag a partial write.
  if (!(await getFaceIdCredentials())) return;
  await setFaceIdCredentials({
    username: credentials.username.trim(),
    password: credentials.password,
  });
}
