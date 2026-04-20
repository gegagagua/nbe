import { Pressable, Text, View } from 'react-native';

import { DebtorRegistryCopy } from '@/constants/debtor-registry-copy';
import type { DebtorRegistryApplication } from '@/types/debtor-registry';

import { debtorAppListItemStyles as s } from './debtor-app-list-item.styles';

function formatDate(value: string | null) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ');
}

function formatApplicant(app: DebtorRegistryApplication) {
  const first = app.applicants[0];
  if (!first) {
    return 'განმცხადებელი: -';
  }
  const idNumber = first.idnumber ?? '-';
  return `განმცხადებელი: ${first.name ?? '-'} (${idNumber})`;
}

type Props = {
  app: DebtorRegistryApplication;
  onPress: (app: DebtorRegistryApplication) => void;
};

export function DebtorAppListItem({ app, onPress }: Props) {
  const cardId = app.regnumber ?? `(${app.id})`;
  const requestedId = app.requestedPerson.idnumber ?? '-';

  return (
    <Pressable style={({ pressed }) => [s.card, pressed && s.cardPressed]} onPress={() => onPress(app)}>
      <View style={s.topRow}>
        <Text style={s.leftTop}>{cardId}</Text>
        <Text style={s.rightTop}>{formatDate(app.createdDate)}</Text>
      </View>
      <Text style={s.rowText}>
        სტატუსი: {app.status.name} | რეგ.თარიღი: {formatDate(app.regDate)}
      </Text>
      <Text style={s.rowText}>
        საქმის ნომერი: {app.caseNo ?? '-'} | საქმის თარიღი: {formatDate(app.caseDate)}
      </Text>
      <Text style={s.rowText}>
        ტრანზაქცია: {app.trType.name} | #{app.id}
      </Text>
      <Text style={s.rowText}>{formatApplicant(app)}</Text>

      <View style={s.personBox}>
        <Text style={s.personName}>
          {app.requestedPerson.personName ?? '-'} ({requestedId})
        </Text>
        <Text style={s.personAddress}>{app.requestedPerson.address ?? '-'}</Text>
      </View>
      <Text style={s.detailHint}>{DebtorRegistryCopy.detailsOpenHint}</Text>
    </Pressable>
  );
}
