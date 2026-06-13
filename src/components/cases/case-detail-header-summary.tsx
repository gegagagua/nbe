import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
} from '@/constants/debtor-registry';
import type { CaseDetailData } from '@/types/case-detail-data';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';

export function CaseDetailHeaderSummary({ data }: { data: CaseDetailData }) {
  const { t } = useTranslation();
  return (
    <View style={s.headerBlock}>
      <View style={s.bureauRow}>
        <View style={s.headerStack}>
          <Text style={s.caseNo}>
            {t('cases.detail.caseNPrefix')} {data.officialCaseNo}
          </Text>
          {data.bureauLines.map((line) => (
            <View key={line} style={s.bureauIconRow}>
              <MaterialCommunityIcons
                name="folder-outline"
                size={DebtorRegistryLayout.filterPanelIconSize * 0.55}
                color={DebtorRegistryPalette.textPrimary}
              />
              <Text style={s.mutedText}>{line}</Text>
            </View>
          ))}
        </View>
        <Text style={s.categoryRight}>{data.categoryRight}</Text>
      </View>
    </View>
  );
}
