import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
} from '@/constants/debtor-registry';
import type { CaseDetailData } from '@/types/case-detail-data';

import { CaseDetailExtraInfoModal } from './case-detail-extra-info-modal';
import { caseDetailInternalStyles as s } from './case-detail-internal.styles';

/** Category whose cases expose the agency "დამატებითი ინფორმაცია" details. */
const ADMIN_FINE_PREFIX = '08/1';

export function CaseDetailHeaderSummary({ data }: { data: CaseDetailData }) {
  const { t } = useTranslation();
  const [extraInfoOpen, setExtraInfoOpen] = useState(false);
  const showDetails = data.categoryPrefix === ADMIN_FINE_PREFIX;

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
        <View style={s.headerRightCol}>
          <Text style={s.categoryRight}>{data.categoryRight}</Text>
          {showDetails ? (
            <Pressable
              style={s.detailsBtn}
              onPress={() => setExtraInfoOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={t('cases.detail.detailsButtonA11y')}
            >
              <Text style={s.detailsBtnText}>
                {t('cases.detail.detailsButton')}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      {showDetails ? (
        <CaseDetailExtraInfoModal
          visible={extraInfoOpen}
          onClose={() => setExtraInfoOpen(false)}
        />
      ) : null}
    </View>
  );
}
