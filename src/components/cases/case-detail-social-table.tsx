import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { useSsaRequests } from '@/hooks/use-ssa-requests';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { CaseDetailKvCard, CaseDetailKvCardList } from './case-detail-kv-card';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailSocialTable() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? '');
  const { data: rows, isLoading } = useSsaRequests(appId);
  // console.log('rows', rows);
  return (
    <View>
      {isLoading ? (
        <View style={tb.padSm}>
          <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
        </View>
      ) : !rows || rows.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.socialEmpty')}</Text>
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
