import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { LoginPalette } from '@/constants/login';
import { useAppTheme } from '@/theme';
import type { CaseApplication, CaseParty } from '@/types/case-management';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';
import { formatOfficialCaseNumberDisplay } from '@/utils/format-official-case-number';

function formatPartyLine(party: CaseParty) {
  const fullName = [party.firstName, party.lastName].filter(Boolean).join(' ').trim();
  const title = party.organization ?? fullName ?? '—';
  return `${title} (${party.idnumber ?? '—'})`;
}

function debtSummary(item: CaseApplication): string | null {
  const parts = [item.debtCategoryName, item.debtAmountDisplay].filter(Boolean);
  return parts.length > 0 ? parts.join(' — ') : null;
}

/** Pull a numeric GEL amount out of a display string like "160.00 ₾".
 * Keeps a leading minus so negative balances (e.g. "-9.00 ₾") stay negative. */
function parsePayAmount(display?: string | null): number | null {
  if (!display) return null;
  const value = Number.parseFloat(display.replace(/[^\d.-]/g, ''));
  return Number.isFinite(value) ? value : null;
}

export function CaseListItem({ item, index = 0 }: { item: CaseApplication; index?: number }) {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const officialNo = formatOfficialCaseNumberDisplay(item.regnumber, item.id);
  const regDate = item.regDate ? formatEnforcementDateTime(item.regDate) : null;
  const headlineDate = formatEnforcementDateTime(
    item.finalRegistrationAt ?? item.inputDate,
  );
  const accentColor = item.status.colorCode || LoginPalette.primary;
  // The category "number" (e.g. "03/3") comes from trType.prefix; the spec wants
  // it shown next to the category name, matching the case-detail header.
  const categoryLine = item.trType.prefix
    ? `${item.trType.prefix} ${item.trType.name}`.trim()
    : item.trType.name;
  const debt = debtSummary(item);
  const payAmount = parsePayAmount(item.debtAmountDisplay);
  const payPersonId = item.debtors[0]?.id;
  const a11y = `${officialNo}. ${t('cases.openCaseA11yHint')}`;

  return (
    <Animated.View entering={FadeInDown.duration(280).delay(Math.min(index, 8) * 40).springify().damping(18)}>
      <AnimatedPressable
        className="w-full"
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
      <View
        className="rounded-md border border-l-4 border-border bg-surface p-4"
        style={[theme.shadows.sm, { borderLeftColor: accentColor }]}>
        <View className="mb-2">
          {item.listSequenceLabel ? (
            <Text className="text-caption font-semibold text-fg-muted mb-0.5">{item.listSequenceLabel}</Text>
          ) : (
            <Text className="text-caption font-semibold text-fg-muted mb-0.5">{item.trType.prefix}</Text>
          )}
          <Text className="text-body font-bold text-fg mt-0.5">
            {t('cases.listCaseNumberLabel')}: {officialNo}
          </Text>
          {regDate ? (
            <Text className="text-caption text-fg-muted mt-0.5">
              {t('cases.listRegDateLabel')}: {regDate}
            </Text>
          ) : null}
          <Text className="text-caption text-fg-muted mt-0.5">
            {t('cases.listRegistrationLine')}: {headlineDate}
          </Text>
          <Text className="text-caption text-fg mt-1 leading-[18px]">{categoryLine}</Text>
          {item.enforcementBureauName ? (
            <Text className="text-caption text-fg-muted mt-1">{item.enforcementBureauName}</Text>
          ) : null}
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 min-w-0 rounded-sm border border-border bg-surface-sunken p-2 gap-1">
            <Text className="text-caption font-bold text-fg-muted">{t('cases.creditor')}</Text>
            {item.creditors.length === 0 ? (
              <Text className="text-caption font-semibold text-fg">—</Text>
            ) : (
              item.creditors.map((c) => (
                <Text key={c.id} className="text-caption font-semibold text-fg">
                  {formatPartyLine(c)}
                </Text>
              ))
            )}
          </View>
          <View className="flex-1 min-w-0 rounded-sm border border-border bg-surface-sunken p-2 gap-1">
            <Text className="text-caption font-bold text-fg-muted">{t('cases.debtor')}</Text>
            {item.debtors.length === 0 ? (
              <Text className="text-caption font-semibold text-fg">—</Text>
            ) : (
              item.debtors.map((d) => (
                <Text key={d.id} className="text-caption font-semibold text-fg">
                  {formatPartyLine(d)}
                </Text>
              ))
            )}
          </View>
        </View>
        {debt ? (
          <View className="mt-2 pt-2 border-t border-border">
            <View className="flex-row flex-wrap items-baseline gap-1">
              <Text className="text-label font-semibold text-fg">{t('cases.listDebtLine')}:</Text>
              <Text className="text-body font-bold text-fg">{debt}</Text>
            </View>
          </View>
        ) : null}
      </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
