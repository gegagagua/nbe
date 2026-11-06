import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { useAppTheme } from '@/theme';
import { useSsaRequests } from '@/hooks/use-ssa-requests';

import { CaseDetailKvCard, CaseDetailKvCardList } from './case-detail-kv-card';

export function CaseDetailSocialTable() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? '');
  const { data: rows, isLoading } = useSsaRequests(appId);

  return (
    <View>
      {isLoading ? (
        <View className="p-2">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : !rows || rows.length === 0 ? (
        <Text className="p-2 text-caption text-fg-secondary">{t('cases.detail.socialEmpty')}</Text>
      ) : (
        <CaseDetailKvCardList>
          {rows.map((row, i) => (
            <CaseDetailKvCard
              key={`${row.personalId || row.name}-${i}`}
              rows={[
                {
                  label: t('cases.detail.socialColPerson'),
                  value: row.name || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.socialColPersonalId'),
                  value: row.personalId || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.socialColAddressPhone'),
                  value: row.addressPhone || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.socialColSent'),
                  value: row.sent ? '✓' : t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.socialColReceived'),
                  value: row.receivedAt || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.socialColStatus'),
                  value: row.active
                    ? t('cases.detail.socialStatusActive')
                    : t('cases.detail.socialStatusInactive'),
                },
                {
                  label: t('cases.detail.socialColVulnerable'),
                  value: row.vulnerable ? t('cases.detail.socialYes') : t('cases.detail.socialNo'),
                },
              ]}
            />
          ))}
        </CaseDetailKvCardList>
      )}
    </View>
  );
}
