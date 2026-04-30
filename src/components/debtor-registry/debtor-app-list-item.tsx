import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { DebtorRegistryApplication } from '@/types/debtor-registry';

import { debtorAppListItemStyles as s } from './debtor-app-list-item.styles';

function formatDate(value: string | null) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ');
}

type Props = {
  app: DebtorRegistryApplication;
  onPress: (app: DebtorRegistryApplication) => void;
};

export function DebtorAppListItem({ app, onPress }: Props) {
  const { t } = useTranslation();
  const cardId = app.regnumber ?? `(${app.id})`;
  const requestedId = app.requestedPerson?.idnumber ?? '-';
  const requestedName = app.requestedPerson?.personName ?? '-';
  const requestedAddress = app.requestedPerson?.address ?? '-';
  const statusName = app.status?.name ?? '-';
  const trTypeName = app.trType?.name ?? '-';
  const first = app.applicants?.[0];
  const applicantLine = first
    ? `${t('debtors.listApplicantPrefix')} ${first.name ?? '-'} (${first.idnumber ?? '-'})`
    : `${t('debtors.listApplicantPrefix')} -`;

  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <Text style={s.leftTop}>{cardId}</Text>
        <Text style={s.rightTop}>{formatDate(app.createdDate)}</Text>
      </View>
      <Text style={s.rowText}>
        {t('debtors.listRowStatus', { status: statusName, regDate: formatDate(app.regDate) })}
      </Text>
      <Text style={s.rowText}>
        {t('debtors.listRowCase', {
          caseNo: app.caseNo ?? '-',
          caseDate: formatDate(app.caseDate),
        })}
      </Text>
      <Text style={s.rowText}>
        {t('debtors.listRowTr', { trType: trTypeName, id: String(app.id) })}
      </Text>
      <Text style={s.rowText}>{applicantLine}</Text>

      <View style={s.personBox}>
        <Text style={s.personName}>
          {requestedName} ({requestedId})
        </Text>
        <Text style={s.personAddress}>{requestedAddress}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('debtors.detailsOpenHint')}
        style={({ pressed }) => [s.actionButton, pressed && s.cardPressed]}
        onPress={() => onPress(app)}>
        <Text style={s.actionText}>{t('debtors.statementAction')}</Text>
      </Pressable>
    </View>
  );
}
