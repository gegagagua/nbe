import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import type { DebtorRegistryApplication } from '@/types/debtor-registry';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

import { DebtorRegistryApplicationRowActions } from './debtor-registry-application-row-actions';
import { debtorRegistryApplicationRowStyles as s } from './debtor-registry-application-row.styles';

function applicationNo(app: DebtorRegistryApplication) {
  const r = app.regnumber?.trim();
  return r && r.length > 0 ? r : `#${app.id}`;
}

function caseNoWithDePrefix(caseNo: string | null) {
  const raw = caseNo?.trim();
  if (!raw) return '—';
  if (raw.toUpperCase().startsWith('DE')) return raw;
  if (raw.startsWith('A')) return `DE${raw.slice(1)}`;
  return `DE${raw}`;
}

function applicantPrimaryLine(app: DebtorRegistryApplication, t: TFunction) {
  const a = app.applicants?.[0];
  if (a?.name) {
    const tail = a.idnumber ? ` (${a.idnumber})` : '';
    return `${t('debtors.listApplicantPrefix')} ${a.name}${tail}`;
  }
  return `${t('debtors.listApplicantPrefix')} ${app.createdBy.name}`;
}

export function DebtorRegistryApplicationRow({ app }: { app: DebtorRegistryApplication }) {
  const { t } = useTranslation();
  const applicant = app.applicants?.[0];
  const requested = app.requestedPerson;
  const statusName = app.status?.name ?? '—';
  const regDate = formatEnforcementDateTime(app.regDate ?? app.statusDate);
  const caseNo = caseNoWithDePrefix(app.caseNo);
  const caseDate = formatEnforcementDateTime(app.caseDate);
  const trName = app.trType?.name ?? '—';
  const requestedName = requested?.personName ?? '—';
  const requestedIdentifier = requested?.idnumber ?? '—';
  return (
    <View style={s.card}>
      <Text style={s.title}>{applicationNo(app)}</Text>
      <Text style={s.meta}>
        {t('debtors.listRowStatus', { status: statusName, regDate })}
      </Text>
      <Text style={s.meta}>{t('debtors.listRowCase', { caseNo, caseDate })}</Text>
      <Text style={s.meta}>{t('debtors.listRowTr', { trType: trName, id: String(app.id) })}</Text>
      <Text style={s.meta}>
        {t('debtors.listRequestedSubject', {
          name: requestedName,
          identifier: requestedIdentifier,
        })}
      </Text>
      <Text style={s.meta}>{applicantPrimaryLine(app, t)}</Text>
      {applicant?.address ? <Text style={s.meta}>{applicant.address}</Text> : null}
      <DebtorRegistryApplicationRowActions app={app} />
    </View>
  );
}
