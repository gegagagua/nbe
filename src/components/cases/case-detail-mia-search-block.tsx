import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import type { AppPersonType } from '@/api/mia';
import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { useMiaInfoRests, useMiaProperties } from '@/hooks/use-mia-properties';
import type { CaseDetailSearchPropertyRow } from '@/types/case-detail-data';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { CaseDetailKvCard, CaseDetailKvCardList } from './case-detail-kv-card';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

/** Shared renderer for the property/restriction rows (identical column layout). */
function CaseDetailMiaRows({
  rows,
  isLoading,
}: {
  rows: CaseDetailSearchPropertyRow[] | undefined;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <View style={tb.padSm}>
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      </View>
    );
  }
  if (!rows || rows.length === 0) {
    return <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>;
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
                  <Text style={[s.primaryText, tb.kvValueText]}>{row.nameObject}</Text>
                  {row.plateOrExtra ? (
                    <Text style={[s.mutedText, tb.kvValueText]}>{row.plateOrExtra}</Text>
                  ) : null}
                  {row.address ? (
                    <Text style={[s.mutedText, tb.kvValueText]}>{row.address}</Text>
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
      <Text style={tb.subSectionTitle}>{t('cases.detail.subFoundProperty')}</Text>
      <CaseDetailMiaRows rows={restrictions} isLoading={restrictionsLoading} />
      <Text style={tb.subSectionTitle}>{t('cases.detail.subRestrictions')}</Text>
      <CaseDetailMiaRows rows={properties} isLoading={propertiesLoading} />
    </View>
  );
}
