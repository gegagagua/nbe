import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import type { AppPersonType } from '@/api/mia';
import { useAppTheme } from '@/theme';
import { useMiaInfoRests, useMiaProperties } from '@/hooks/use-mia-properties';
import type { CaseDetailSearchPropertyRow } from '@/types/case-detail-data';

import { CaseDetailKvCard, CaseDetailKvCardList } from './case-detail-kv-card';

/** Shared renderer for the property/restriction rows (identical column layout). */
function CaseDetailMiaRows({
  rows,
  isLoading,
}: {
  rows: CaseDetailSearchPropertyRow[] | undefined;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  if (isLoading) {
    return (
      <View className="p-2">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (!rows || rows.length === 0) {
    return <Text className="p-2 text-caption text-fg-secondary">{t('cases.detail.emptyTable')}</Text>;
  }
  return (
    <CaseDetailKvCardList>
      {rows.map((row) => (
        <CaseDetailKvCard
          key={`${row.orderRef}-${row.nameObject}`}
          rows={[
            {
              label: t('cases.detail.searchColNameObject'),
              value: (
                <>
                  <Text className="text-right text-label font-bold text-fg">{row.nameObject}</Text>
                  {row.plateOrExtra ? (
                    <Text className="text-right text-caption text-fg-secondary">{row.plateOrExtra}</Text>
                  ) : null}
                  {row.address ? (
                    <Text className="text-right text-caption text-fg-secondary">{row.address}</Text>
                  ) : null}
                </>
              ),
            },
            {
              label: t('cases.detail.searchColOrder'),
              value: (
                <>
                  <Text className="text-right text-label font-bold text-fg">{row.orderRef}</Text>
                  <Text className="text-right text-caption text-fg-secondary">{row.orderAction}</Text>
                </>
              ),
            },
            {
              label: t('cases.detail.searchColInitiator'),
              value: (
                <>
                  <Text className="text-right text-label font-bold text-fg">{row.initiator}</Text>
                  <Text className="text-right text-caption text-fg-secondary">{row.initiatorWhen}</Text>
                </>
              ),
            },
          ]}
        />
      ))}
    </CaseDetailKvCardList>
  );
}

export function CaseDetailMiaSearchBlock({
  appPersonTypeId,
}: {
  appPersonTypeId: AppPersonType;
}) {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? '');
  const { data: properties, isLoading: propertiesLoading } = useMiaProperties(
    appId,
    appPersonTypeId,
  );
  const { data: restrictions, isLoading: restrictionsLoading } = useMiaInfoRests(
    appId,
    appPersonTypeId,
  );
  return (
    <View>
      <Text className="bg-surface-sunken p-2 text-label font-bold text-fg">{t('cases.detail.subFoundProperty')}</Text>
      <CaseDetailMiaRows rows={restrictions} isLoading={restrictionsLoading} />
      <Text className="bg-surface-sunken p-2 text-label font-bold text-fg">{t('cases.detail.subRestrictions')}</Text>
      <CaseDetailMiaRows rows={properties} isLoading={propertiesLoading} />
    </View>
  );
}
