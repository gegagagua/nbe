import type { TFunction } from 'i18next';
import { Linking, Pressable, Share, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { LoginInteraction } from '@/constants/login';
import { ToastLayout } from '@/constants/toast';
import type { DebtorRegistryApplication } from '@/types/debtor-registry';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

import { debtorRegistryApplicationRowActionsStyles as s } from './debtor-registry-application-row-actions.styles';

function shareSummary(app: DebtorRegistryApplication, t: TFunction) {
  const appNo = app.regnumber?.trim() && app.regnumber.trim().length > 0 ? app.regnumber.trim() : `#${app.id}`;
  const applicant = app.applicants?.[0];
  const applicantLine = applicant?.name
    ? `${t('debtors.listApplicantPrefix')} ${applicant.name}${applicant.idnumber ? ` (${applicant.idnumber})` : ''}`
    : `${t('debtors.listApplicantPrefix')} ${app.createdBy.name}`;
  const applicantAddr = applicant?.address?.trim() ? applicant.address.trim() : '';
  const caseNo = app.caseNo ?? '—';
  const caseDate = formatEnforcementDateTime(app.caseDate);
  const regDate = formatEnforcementDateTime(app.regDate ?? app.statusDate);
  const statusName = app.status?.name ?? '—';
  const trName = app.trType?.name ?? '—';
  const url = app.downloadUrl?.trim() ?? '';
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

type Props = { app: DebtorRegistryApplication };

export function DebtorRegistryApplicationRowActions({ app }: Props) {
  const { t } = useTranslation();
  const onDownload = () => {
    const url = app.downloadUrl?.trim();
    if (!url) {
      Toast.show({
        type: 'info',
        text1: t('debtors.listDownloadNoUrlToast'),
        visibilityTime: ToastLayout.visibilityMs,
        position: 'top',
      });
      return;
    }
    void Linking.openURL(url);
  };
  const onShare = () => {
    void Share.share({
      title: t('debtors.listShareTitle'),
      message: shareSummary(app, t),
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
