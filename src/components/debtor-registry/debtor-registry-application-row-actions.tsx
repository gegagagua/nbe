import type { TFunction } from 'i18next';
import { Linking, Pressable, Share, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { LoginInteraction } from '@/constants/login';
import { ToastLayout } from '@/constants/toast';
import type {
  DebtorRegistryApplicant,
  DebtorRegistryStatus,
  DebtorRegistryUser,
} from '@/types/debtor-registry';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

import { debtorRegistryApplicationRowActionsStyles as s } from './debtor-registry-application-row-actions.styles';

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
  const onDownload = () => {
    if (!documentUrl) {
      Toast.show({
        type: 'info',
        text1: t('debtors.listDownloadNoUrlToast'),
        visibilityTime: ToastLayout.visibilityMs,
        position: 'top',
      });
      return;
    }
    Linking.openURL(documentUrl);
  };
  const onShare = () => {
    Share.share({
      title: t('debtors.listShareTitle'),
      message: shareSummary(app, t),
      ...(documentUrl ? { url: documentUrl } : {}),
    });
  };
  return (
    <View style={s.row}>
      <Pressable
        style={({ pressed }) => [s.btn, pressed && { opacity: LoginInteraction.pressedOpacity }]}
        accessibilityRole="button"
        accessibilityLabel={t('debtors.listDownload')}
        onPress={onDownload}>
        <Text style={s.btnLabel}>{t('debtors.listDownload')}</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [s.btn, pressed && { opacity: LoginInteraction.pressedOpacity }]}
        accessibilityRole="button"
        accessibilityLabel={t('debtors.listShare')}
        onPress={onShare}>
        <Text style={s.btnLabel}>{t('debtors.listShare')}</Text>
      </Pressable>
    </View>
  );
}
