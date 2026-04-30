import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { CaseManagementCopy } from '@/constants/case-management-copy';
import type { CaseApplication, CaseParty } from '@/types/case-management';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';
import { formatOfficialCaseNumberDisplay } from '@/utils/format-official-case-number';

import { caseListItemStyles as s } from './case-list-item.styles';

function formatPartyLine(party: CaseParty) {
  const fullName = [party.firstName, party.lastName].filter(Boolean).join(' ').trim();
  const title = party.organization ?? fullName ?? '—';
  return `${title} (${party.idnumber ?? '—'})`;
}

function debtSummary(item: CaseApplication): string | null {
  const parts = [item.debtCategoryName, item.debtAmountDisplay].filter(Boolean);
  return parts.length > 0 ? parts.join(' — ') : null;
}

export function CaseListItem({ item }: { item: CaseApplication }) {
  const officialNo = formatOfficialCaseNumberDisplay(item.regnumber, item.id);
  const headlineDate = formatEnforcementDateTime(
    item.finalRegistrationAt ?? item.inputDate,
  );
  const accent = item.cardAccentColor;
  const debt = debtSummary(item);

  return (
    <Pressable
      style={s.press}
      onPress={() => router.push(`/cases/${String(item.id)}`)}
      accessibilityRole="button"
      accessibilityLabel={`${officialNo}. ${CaseManagementCopy.openCaseA11yHint}`}>
      <View style={[s.card, accent ? [s.cardAccent, { borderLeftColor: accent }] : undefined]}>
        <View style={s.topBlock}>
          {item.listSequenceLabel ? (
            <Text style={s.sequence}>{item.listSequenceLabel}</Text>
          ) : (
            <Text style={s.sequence}>{item.trType.prefix}</Text>
          )}
          <Text style={s.caseNumber}>
            {CaseManagementCopy.listCaseNumberLabel}: {officialNo}
          </Text>
          <Text style={s.caseDate}>{headlineDate}</Text>
          <Text style={s.caseTitle}>{item.trType.name}</Text>
          {item.enforcementBureauName ? (
            <Text style={s.bureau}>{item.enforcementBureauName}</Text>
          ) : null}
        </View>
        <View style={s.partiesRow}>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>{CaseManagementCopy.creditor}</Text>
            {item.creditors.length === 0 ? (
              <Text style={s.partyLine}>—</Text>
            ) : (
              item.creditors.map((c) => (
                <Text key={c.id} style={s.partyLine}>
                  {formatPartyLine(c)}
                </Text>
              ))
            )}
          </View>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>{CaseManagementCopy.debtor}</Text>
            {item.debtors.length === 0 ? (
              <Text style={s.partyLine}>—</Text>
            ) : (
              item.debtors.map((d) => (
                <Text key={d.id} style={s.partyLine}>
                  {formatPartyLine(d)}
                </Text>
              ))
            )}
          </View>
        </View>
        {debt ? (
          <View style={s.debtRow}>
            <View style={s.debtLineInner}>
              <Text style={s.debtLabel}>{CaseManagementCopy.listDebtLine}:</Text>
              <Text style={s.debtValue}>{debt}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
