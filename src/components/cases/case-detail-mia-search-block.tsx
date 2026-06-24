import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { AppPersonType } from '@/api/mia';
import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { useMiaProperties } from '@/hooks/use-mia-properties';

import { CaseDetailKvCard, CaseDetailKvCardList } from './case-detail-kv-card';
import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailMiaSearchBlock({
  appPersonTypeId,
}: {
  appPersonTypeId: AppPersonType;
}) {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? '');
  const { data: rows, isLoading } = useMiaProperties(appId, appPersonTypeId);
  return (
    <View>
      <Text style={tb.subSectionTitle}>{t('cases.detail.subFoundProperty')}</Text>
      {isLoading ? (
        <View style={tb.padSm}>
          <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
        </View>
      ) : !rows || rows.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        <CaseDetailKvCardList>
          {rows.map((row) => (
            <CaseDetailKvCard
              key={`${row.orderRef}-${row.nameObject}`}
              rows={[
                {
                  label: t('cases.detail.searchColNameObject'),
                  value: (
                    <>
                      <Text style={[s.primaryText, tb.kvValueText]}>{row.nameObject}</Text>
                      {row.plateOrExtra ? (
                        <Text style={[s.mutedText, tb.kvValueText]}>{row.plateOrExtra}</Text>
                      ) : null}
                    </>
                  ),
                },
                {
                  label: t('cases.detail.searchColOrder'),
                  value: (
                    <>
                      <Text style={[s.primaryText, tb.kvValueText]}>{row.orderRef}</Text>
                      <Text style={[s.mutedText, tb.kvValueText]}>{row.orderAction}</Text>
                    </>
                  ),
                },
                {
                  label: t('cases.detail.searchColInitiator'),
                  value: (
                    <>
                      <Text style={[s.primaryText, tb.kvValueText]}>{row.initiator}</Text>
                      <Text style={[s.mutedText, tb.kvValueText]}>{row.initiatorWhen}</Text>
                    </>
                  ),
                },
              ]}
            />
          ))}
        </CaseDetailKvCardList>
      )}
      <Text style={tb.subSectionTitle}>{t('cases.detail.subRestrictions')}</Text>
      <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
    </View>
  );
}
