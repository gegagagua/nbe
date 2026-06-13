import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { LoginPalette } from '@/constants/login';
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

/** Pull a numeric GEL amount out of a display string like "160.00 ₾". */
function parsePayAmount(display?: string | null): number | null {
  if (!display) return null;
  const value = Number.parseFloat(display.replace(/[^\d.]/g, ''));
  return Number.isFinite(value) ? value : null;
}

export function CaseListItem({ item, index = 0 }: { item: CaseApplication; index?: number }) {
  const { t } = useTranslation();
  const officialNo = formatOfficialCaseNumberDisplay(item.regnumber, item.id);
  const regDate = item.regDate ? formatEnforcementDateTime(item.regDate) : null;
  const headlineDate = formatEnforcementDateTime(
    item.finalRegistrationAt ?? item.inputDate,
  );
  const accentColor = item.status.colorCode || LoginPalette.primary;
  const debt = debtSummary(item);
  const payAmount = parsePayAmount(item.debtAmountDisplay);
  const payPersonId = item.debtors[0]?.id;
  const a11y = `${officialNo}. ${t('cases.openCaseA11yHint')}`;

  return (
    <Animated.View entering={FadeInDown.duration(280).delay(Math.min(index, 8) * 40).springify().damping(18)}>
      <AnimatedPressable
        style={s.press}
        onPress={() =>
          router.push({
            pathname: '/cases/[id]',
            params: {
              id: String(item.id),
              personId: payPersonId != null ? String(payPersonId) : '',
              amount: payAmount != null ? String(payAmount) : '',
              payDisplay: item.debtAmountDisplay ?? '',
            },
          })
        }
        accessibilityRole="button"
        accessibilityLabel={a11y}>
      <View style={[s.card, s.cardAccent, { borderLeftColor: accentColor }]}>
        <View style={s.topBlock}>
          {item.listSequenceLabel ? (
            <Text style={s.sequence}>{item.listSequenceLabel}</Text>
          ) : (
            <Text style={s.sequence}>{item.trType.prefix}</Text>
          )}
          <Text style={s.caseNumber}>
            {t('cases.listCaseNumberLabel')}: {officialNo}
          </Text>
          {regDate ? (
            <Text style={s.caseDate}>
              {t('cases.listRegDateLabel')}: {regDate}
            </Text>
          ) : null}
          <Text style={s.caseDate}>
            {t('cases.listRegistrationLine')}: {headlineDate}
          </Text>
          <Text style={s.caseTitle}>{item.trType.name}</Text>
          {item.enforcementBureauName ? (
            <Text style={s.bureau}>{item.enforcementBureauName}</Text>
          ) : null}
        </View>
        <View style={s.partiesRow}>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>{t('cases.creditor')}</Text>
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
            <Text style={s.partyLabel}>{t('cases.debtor')}</Text>
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
              <Text style={s.debtLabel}>{t('cases.listDebtLine')}:</Text>
              <Text style={s.debtValue}>{debt}</Text>
            </View>
          </View>
        ) : null}
      </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
