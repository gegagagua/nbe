import { router } from 'expo-router';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import type { DebtorRegistryApplication } from '@/types/debtor-registry';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

import { debtorRegistryApplicationRowStyles as s } from './debtor-registry-application-row.styles';

function applicationNo(app: DebtorRegistryApplication) {
  const r = app.regnumber?.trim();
  return r && r.length > 0 ? r : `#${app.id}`;
}

function applicantPrimaryLine(app: DebtorRegistryApplication, t: TFunction) {
  const a = app.applicants?.[0];
  if (a?.name) {
    return `${t('debtors.listApplicantPrefix')} ${a.name}`;
  }
  return `${t('debtors.listApplicantPrefix')} ${app.createdBy.name}`;
}

export function DebtorRegistryApplicationRow({ app }: { app: DebtorRegistryApplication }) {
  const { t } = useTranslation();
  const requested = app.requestedPerson;
  const regDate = formatEnforcementDateTime(app.regDate ?? app.statusDate);
  const requestedName = requested?.personName ?? '—';
  const requestedIdentifier = requested?.idnumber ?? '—';
  return (
    <Pressable
      style={s.card}
      accessibilityRole="button"
      accessibilityHint={t('debtors.detailsOpenHint')}
      onPress={() =>
        router.push({ pathname: '/debtors/[id]', params: { id: String(app.id) } })
      }>
      <Text style={s.title}>{applicationNo(app)}</Text>
      <Text style={s.meta}>{regDate}</Text>
      <Text style={s.meta}>{applicantPrimaryLine(app, t)}</Text>
      <Text style={s.meta}>
        {t('debtors.listRequestedSubject', { name: requestedName })}
      </Text>
      <Text style={s.meta}>
        {t('debtors.listRequestedSubjectId', { identifier: requestedIdentifier })}
      </Text>
    </Pressable>
  );
}
