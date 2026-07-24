import { Platform } from 'react-native';

import { getDebtorAppFiles, streamDebtorFile } from '@/api/debtor-apps';
import {
  openAndroidViewer,
  prepareStreamedFile,
  shareCachedFile,
} from '@/lib/download-eps-file';

export async function downloadDebtorAppFile(
  appId: number,
): Promise<'downloaded' | 'no-file'> {
  const files = await getDebtorAppFiles(appId);
  const target = files[0];
  if (!target) {
    return 'no-file';
  }

  const fileId = target.file.id;
  const fileName = target.file.fileName || `file-${fileId}.pdf`;

  const prepared = await prepareStreamedFile(
    (responseType) => streamDebtorFile(appId, fileId, responseType),
    { fileId, fileName },
  );

  if (!prepared) {
    return 'downloaded';
  }
  if (Platform.OS === 'android') {
    await openAndroidViewer(prepared);
  } else {
    await shareCachedFile(prepared);
  }
  return 'downloaded';
}
