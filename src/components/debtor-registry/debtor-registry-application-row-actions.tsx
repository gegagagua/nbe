import type { TFunction } from 'i18next';
import { useState } from 'react';
import { Share, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { CaseDetailFileViewerModal } from '@/components/cases/case-detail-file-viewer-modal';
import { Button } from '@/components/ui/button';
import { ToastLayout } from '@/constants/toast';
import { downloadDebtorAppFile } from '@/lib/download-debtor-file';
import type { PreparedFile } from '@/lib/download-eps-file';
import { showErrorToast } from '@/lib/show-error-toast';
import type {
  DebtorRegistryApplicant,
  DebtorRegistryStatus,
  DebtorRegistryUser,
} from '@/types/debtor-registry';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

// Structural subset shared by the list row (`DebtorRegistryApplication`) and the
// detail response (`DebtorRegistryApplicationDetail`), so the actions work on both.
type DebtorAppActionsSource = {
  id: number;
  regnumber: string | null;
  regDate: string | null;
  statusDate?: string | null;
  status?: DebtorRegistryStatus | null;
  trType?: DebtorRegistryStatus | null;
  caseNo: string | null;
  caseDate: string | null;
  createdBy?: DebtorRegistryUser | null;
  applicants?: DebtorRegistryApplicant[];
  downloadUrl?: string | null;
};

function resolveDocumentUrl(app: DebtorAppActionsSource): string {
  return app.downloadUrl?.trim() ?? '';
}

function shareSummary(app: DebtorAppActionsSource, t: TFunction) {
  const appNo = app.regnumber?.trim() && app.regnumber.trim().length > 0 ? app.regnumber.trim() : `#${app.id}`;
  const applicant = app.applicants?.[0];
  const applicantName = applicant?.name ?? app.createdBy?.name ?? '—';
  const applicantLine = `${t('debtors.listApplicantPrefix')} ${applicantName}${applicant?.idnumber ? ` (${applicant.idnumber})` : ''}`;
  const applicantAddr = applicant?.address?.trim() ? applicant.address.trim() : '';
  const caseNo = app.caseNo ?? '—';
  const caseDate = formatEnforcementDateTime(app.caseDate);
  const regDate = formatEnforcementDateTime(app.regDate ?? app.statusDate);
  const statusName = app.status?.name ?? '—';
  const trName = app.trType?.name ?? '—';
  const url = resolveDocumentUrl(app);
  return [
    appNo,
    t('debtors.listRowStatus', { status: statusName, regDate }),
    t('debtors.listRowCase', { caseNo, caseDate }),
    t('debtors.listRowTr', { trType: trName, id: String(app.id) }),
    applicantLine,
    applicantAddr,
    url,
  ]
    .filter(Boolean)
    .join('\n');
}

type Props = { app: DebtorAppActionsSource };

export function DebtorRegistryApplicationRowActions({ app }: Props) {
  const { t } = useTranslation();
  const documentUrl = resolveDocumentUrl(app);
  const [downloading, setDownloading] = useState(false);
  const [viewerFile, setViewerFile] = useState<PreparedFile | null>(null);
  const onDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const result = await downloadDebtorAppFile(app.id);
      if (result.status === 'no-file') {
        Toast.show({
          type: 'info',
          text1: t('debtors.listDownloadNoFileToast'),
          visibilityTime: ToastLayout.visibilityMs,
          position: 'top',
        });
      } else if (result.status === 'preview') {
        setViewerFile(result.file);
      }
    } catch (err) {
      showErrorToast(t('debtors.listDownloadError'), err);
    } finally {
      setDownloading(false);
    }
  };
  const onShare = () => {
    Share.share({
      title: t('debtors.listShareTitle'),
      message: shareSummary(app, t),
      ...(documentUrl ? { url: documentUrl } : {}),
    });
  };
  return (
    <>
    <View className="mt-2 flex-row gap-2">
      <View className="flex-1">
        <Button
          label={t('debtors.listDownload')}
          variant="secondary"
          loading={downloading}
          disabled={downloading}
          onPress={onDownload}
        />
      </View>
      <View className="flex-1">
        <Button label={t('debtors.listShare')} variant="secondary" onPress={onShare} />
      </View>
    </View>
    <CaseDetailFileViewerModal
      file={viewerFile}
      onClose={() => setViewerFile(null)}
      actionLabel={t('debtors.viewerDownload')}
      actionIcon="tray-arrow-down"
    />
    </>
  );
}
