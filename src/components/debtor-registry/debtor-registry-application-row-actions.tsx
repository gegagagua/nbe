import type { TFunction } from 'i18next';
import { Linking, Pressable, Share, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LoginInteraction } from '@/constants/login';
import type { DebtorRegistryApplication } from '@/types/debtor-registry';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

import { debtorRegistryApplicationRowActionsStyles as s } from './debtor-registry-application-row-actions.styles';

function resolveDocumentUrl(app: DebtorRegistryApplication): string {
  return app.downloadUrl?.trim() ?? '';
}

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

type Props = { app: DebtorRegistryApplication };

export function DebtorRegistryApplicationRowActions({ app }: Props) {
  const { t } = useTranslation();
  const documentUrl = resolveDocumentUrl(app);
  const onDownload = () => {
    if (!documentUrl) return;
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
