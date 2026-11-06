import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { DebtorRegistryLayout } from '@/constants/debtor-registry';
import { useAppTheme } from '@/theme';
import type { CaseDetailData } from '@/types/case-detail-data';

import { CaseDetailExtraInfoModal } from './case-detail-extra-info-modal';

/** Category whose cases expose the agency "დამატებითი ინფორმაცია" details. */
const ADMIN_FINE_PREFIX = '08/1';

export function CaseDetailHeaderSummary({ data }: { data: CaseDetailData }) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [extraInfoOpen, setExtraInfoOpen] = useState(false);
  const showDetails = data.categoryPrefix === ADMIN_FINE_PREFIX;

  return (
    <View className="mb-4 gap-2">
      <View className="flex-row items-start gap-2">
        <View className="flex-1 gap-1">
          <Text className="text-body-lg font-bold text-fg">
            {t('cases.detail.caseNPrefix')} {data.officialCaseNo}
          </Text>
          {data.bureauLines.map((line) => (
            <View key={line} className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="folder-outline"
                size={DebtorRegistryLayout.filterPanelIconSize * 0.55}
                color={colors.text}
              />
              <Text className="text-caption text-fg-secondary">{line}</Text>
            </View>
          ))}
        </View>
        <View className="flex-1 items-end gap-2">
          <Text className="text-right text-caption text-fg-secondary">{data.categoryRight}</Text>
          {showDetails ? (
            <Pressable
              className="rounded-md bg-primary px-4 py-1"
              onPress={() => setExtraInfoOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={t('cases.detail.detailsButtonA11y')}
            >
              <Text className="text-caption font-bold text-on-primary">
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
