import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card } from '@/components/ui/card';
import type { DebtorRegistryApplication } from '@/types/debtor-registry';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

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
  const isRegistered = (app.regnumber ?? '').trim().length > 0;
  const createdDate = formatEnforcementDateTime(app.createdDate);
  const regDate = formatEnforcementDateTime(app.statusDate);
  const applicant = app.applicants?.[0];
  const applicantName = applicant?.name ?? app.createdBy.name;
  const applicantId = applicant?.idnumber;
  const requested = app.requestedPerson;

  return (
    <Animated.View
      entering={FadeInDown.duration(280).delay(Math.min(index, 8) * 40).springify().damping(18)}>
      <Card
        className="gap-2 border-l-4 border-l-primary"
        accessibilityLabel={applicationNo(app)}
        onPress={() =>
          // Applicant details only exist in the search response, not in
          // GET /apps/{id} — hand them to the detail screen via params.
          router.push({
            pathname: '/debtors/[id]',
            params: {
              id: String(app.id),
              applicantName,
              applicantId: applicantId ?? '',
              payCode: applicant?.payCode ?? '',
            },
          })
        }>
        <Text className="text-label font-bold text-fg">
          {t('debtors.detailsLabelCaseNo')}: {applicationNo(app)}
        </Text>
        <Text className="text-caption text-fg-muted">
          {t('debtors.listCreatedDateLabel')}: {createdDate}
        </Text>
        {isRegistered ? (
          <Text className="text-caption text-fg-muted">
            {t('debtors.listRegDateLabel')}: {regDate}
          </Text>
        ) : null}
        <Text className="text-caption font-semibold text-fg">
          {t('debtors.listApplicantPrefix')} {applicantName}
          {applicantId ? ` (${applicantId})` : ''}
        </Text>
        <View className="mt-2 gap-2 rounded-md border border-border bg-surface-sunken p-2">
          <Text className="text-caption font-bold text-fg-muted">
            {t('debtors.listRequestedSubject', { name: requested?.personName ?? '—' })}
          </Text>
          <Text className="text-caption font-semibold text-fg">
            {t('debtors.listRequestedSubjectId', { identifier: requested?.idnumber ?? '—' })}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}
