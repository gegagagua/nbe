import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { useRegistrySearch } from '@/hooks/use-registry-search';

import { CaseDetailKvCard, CaseDetailKvCardList } from './case-detail-kv-card';
import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailRegistryTables() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? '');
  const { data, isLoading } = useRegistrySearch(appId);

  if (isLoading) {
    return (
      <View style={tb.padSm}>
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      </View>
    );
  }

  const infos = data?.infos ?? [];
  const estates = data?.estates ?? [];

  return (
    <View>
      <Text style={tb.subSectionTitle}>{t('cases.detail.regRequestsTitle')}</Text>
      {infos.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        <CaseDetailKvCardList>
          {infos.map((row, i) => (
            <CaseDetailKvCard
              key={`${row.person}-${i}`}
              rows={[
                { label: t('cases.detail.socialColPerson'), value: row.person },
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

      <Text style={tb.subSectionTitle}>{t('cases.detail.subFoundProperty')}</Text>
      {estates.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
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
