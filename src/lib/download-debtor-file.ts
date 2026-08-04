import { Platform } from 'react-native';

import { getDebtorAppFiles, streamDebtorFile } from '@/api/debtor-apps';
import type { PreparedFile } from '@/lib/download-eps-file';
import { openAndroidViewer, prepareStreamedFile } from '@/lib/download-eps-file';

export type DebtorFileResult =
  | { status: 'no-file' }
  // Web downloaded it, Android handed it to a viewer app — nothing left to do.
  | { status: 'handled' }
  // iOS: opened in the in-app reader, where the user can then share/save it.
  | { status: 'preview'; file: PreparedFile };

export async function downloadDebtorAppFile(
  appId: number,
): Promise<DebtorFileResult> {
  const files = await getDebtorAppFiles(appId);
  const target = files[0];
  if (!target) {
    return { status: 'no-file' };
  }

  const fileId = target.file.id;
  const fileName = target.file.fileName || `file-${fileId}.pdf`;

  const prepared = await prepareStreamedFile(
    (responseType) => streamDebtorFile(appId, fileId, responseType),
    { fileId, fileName },
  );

  if (!prepared) {
    return { status: 'handled' };
  }
  if (Platform.OS === 'android') {
    await openAndroidViewer(prepared);
    return { status: 'handled' };
  }
  return { status: 'preview', file: prepared };
}
