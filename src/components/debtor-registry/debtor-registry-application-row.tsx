import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { LoginPalette } from '@/constants/login';
import type { DebtorRegistryApplication } from '@/types/debtor-registry';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

import { debtorRegistryApplicationRowStyles as s } from './debtor-registry-application-row.styles';

// Registered case → registration number + preliminary number, e.g. "DE26714477 (2588690)".
// Not yet registered (no regnumber) → preliminary number only, e.g. "2588691".
function applicationNo(app: DebtorRegistryApplication) {
  const r = app.regnumber?.trim();
  return r && r.length > 0 ? `${r} (${app.id})` : String(app.id);
}

type Props = {
  app: DebtorRegistryApplication;
  index?: number;
};

export function DebtorRegistryApplicationRow({ app, index = 0 }: Props) {
  const { t } = useTranslation();
  const regDate = formatEnforcementDateTime(app.regDate ?? app.statusDate);
  const applicant = app.applicants?.[0];
  const applicantName = applicant?.name ?? app.createdBy.name;
  const applicantId = applicant?.idnumber;
  const requested = app.requestedPerson;

  return (
    <Animated.View
      entering={FadeInDown.duration(280).delay(Math.min(index, 8) * 40).springify().damping(18)}>
      <AnimatedPressable
        style={s.press}
        accessibilityRole="button"
        accessibilityHint={t('debtors.detailsOpenHint')}
        onPress={() =>
          router.push({ pathname: '/debtors/[id]', params: { id: String(app.id) } })
        }>
        <View style={[s.card, { borderLeftColor: LoginPalette.primary }]}>
          <Text style={s.caseNumber}>
            {t('debtors.detailsLabelCaseNo')}: {applicationNo(app)}
          </Text>
          <Text style={s.caseDate}>
            {t('debtors.listRegDateLabel')}: {regDate}
          </Text>
          <Text style={s.applicantLine}>
            {t('debtors.listApplicantPrefix')} {applicantName}
            {applicantId ? ` (${applicantId})` : ''}
          </Text>
          <View style={s.requestedBox}>
            <Text style={s.requestedLabel}>
              {t('debtors.listRequestedSubject', { name: requested?.personName ?? '—' })}
            </Text>
            <Text style={s.requestedLine}>
              {t('debtors.listRequestedSubjectId', { identifier: requested?.idnumber ?? '—' })}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
