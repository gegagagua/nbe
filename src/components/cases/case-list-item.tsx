import { Text, View } from 'react-native';

import { CaseManagementCopy } from '@/constants/case-management-copy';
import type { CaseApplication, CaseParty } from '@/types/case-management';

import { caseListItemStyles as s } from './case-list-item.styles';

function formatDate(value: string | null) {
  return value ? value.replace('T', ' ') : '-';
}

function formatParty(party: CaseParty | undefined) {
  if (!party) {
    return '-';
  }
  const fullName = [party.firstName, party.lastName].filter(Boolean).join(' ').trim();
  const title = party.organization ?? fullName ?? '-';
  return `${title} (${party.idnumber ?? '-'})`;
}

export function CaseListItem({ item }: { item: CaseApplication }) {
  const appNo = item.regnumber ?? `#${item.id}`;
  const firstCreditor = item.creditors[0];
  const firstDebtor = item.debtors[0];

  return (
    <View style={s.card}>
      <View style={s.row}>
        <View style={s.left}>
          <Text style={s.prefix}>{item.trType.prefix}</Text>
          <Text style={s.text}>
            {appNo} - {formatDate(item.inputDate)}
          </Text>
          <Text style={s.text}>{item.trType.name}</Text>
          <Text style={s.text}>
            {item.status.name} - {formatDate(item.statusDate ?? item.regDate)}
          </Text>
        </View>
        <View style={s.right}>
          <View style={s.partyBox}>
            <Text style={s.partyTitle}>{CaseManagementCopy.creditor}</Text>
            <Text style={s.partyText}>{formatParty(firstCreditor)}</Text>
          </View>
          <View style={s.partyBox}>
            <Text style={s.partyTitle}>{CaseManagementCopy.debtor}</Text>
            <Text style={s.partyText}>{formatParty(firstDebtor)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
