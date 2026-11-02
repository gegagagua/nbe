import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { useAppTheme } from '@/theme';
import { useRegistrySearch } from '@/hooks/use-registry-search';

import { CaseDetailKvCard, CaseDetailKvCardList } from './case-detail-kv-card';

export function CaseDetailRegistryTables() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? '');
  const { data, isLoading } = useRegistrySearch(appId);

  if (isLoading) {
    return (
      <View className="p-2">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const infos = data?.infos ?? [];
  const estates = data?.estates ?? [];

  return (
    <View>
      <Text className="bg-surface-sunken p-2 text-label font-bold text-fg">{t('cases.detail.regRequestsTitle')}</Text>
      {infos.length === 0 ? (
        <Text className="p-2 text-caption text-fg-secondary">{t('cases.detail.emptyTable')}</Text>
      ) : (
        <CaseDetailKvCardList>
          {infos.map((row, i) => (
            <CaseDetailKvCard
              key={`${row.person}-${i}`}
              rows={[
                { label: t('cases.detail.regColPerson'), value: row.person },
                {
                  label: t('cases.detail.socialColSent'),
                  value: row.sent ? '✓' : t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.socialColReceived'),
                  value: row.sentDate || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.socialColStatus'),
                  value: row.found ? t('cases.detail.regFound') : t('cases.detail.regNotFound'),
                },
              ]}
            />
          ))}
        </CaseDetailKvCardList>
      )}

      <Text className="bg-surface-sunken p-2 text-label font-bold text-fg">{t('cases.detail.subFoundProperty')}</Text>
      {estates.length === 0 ? (
        <Text className="p-2 text-caption text-fg-secondary">{t('cases.detail.emptyTable')}</Text>
      ) : (
        <CaseDetailKvCardList>
          {estates.map((row, i) => (
            <CaseDetailKvCard
              key={`${row.cadCode}-${i}`}
              rows={[
                {
                  label: t('cases.detail.regColCadCode'),
                  value: row.cadCode || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.regColOwner'),
                  value: row.ownerName || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.regColAddress'),
                  value: row.address || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.socialColStatus'),
                  value: row.status || t('cases.detail.emptyTable'),
                },
              ]}
            />
          ))}
        </CaseDetailKvCardList>
      )}
    </View>
  );
}
