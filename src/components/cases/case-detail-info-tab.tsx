import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';
import type { CaseDetailInfoSub } from '@/types/case-detail-ui';

import { caseDetailPanelStyles as p } from './case-detail-panels.styles';
import { CaseDetailAuctionBody } from './case-detail-auction-body';
import { CaseDetailFundsBody } from './case-detail-funds-body';
import { CaseDetailInstallmentBody } from './case-detail-installment-body';
import { CaseDetailProceedingsList } from './case-detail-proceedings-list';
import { CaseDetailSearchTab } from './case-detail-search-tab';
import { CaseDetailSubtabSheet } from './case-detail-subtab-sheet';

const SUB_KEYS: CaseDetailInfoSub[] = [
  'proceedings',
  'search',
  'funds',
  'auction',
  'installment',
];

export function CaseDetailInfoTab({ data }: { data: CaseDetailLayoutMock }) {
  const { t } = useTranslation();
  const [sub, setSub] = useState<CaseDetailInfoSub>('proceedings');
  const [sheet, setSheet] = useState(false);
  const labelMap: Record<CaseDetailInfoSub, string> = {
    proceedings: t('cases.detail.subProceedings'),
    search: t('cases.detail.subSearch'),
    funds: t('cases.detail.subFunds'),
    auction: t('cases.detail.subAuction'),
    installment: t('cases.detail.subInstallment'),
  };
  return (
    <View>
      <Pressable style={p.subPicker} onPress={() => setSheet(true)}>
        <Text style={p.subPickerLabel}>{labelMap[sub]}</Text>
        <MaterialCommunityIcons name="menu-down" size={22} color={DebtorRegistryPalette.buttonBg} />
      </Pressable>
      <CaseDetailSubtabSheet
        visible={sheet}
        onClose={() => setSheet(false)}
        onSelect={setSub}
        options={SUB_KEYS.map((key) => ({ key, label: labelMap[key] }))}
      />
      {sub === 'proceedings' ? <CaseDetailProceedingsList proceedings={data.proceedings} /> : null}
      {sub === 'search' ? <CaseDetailSearchTab data={data} /> : null}
      {sub === 'funds' ? <CaseDetailFundsBody data={data} /> : null}
      {sub === 'auction' ? <CaseDetailAuctionBody data={data} /> : null}
      {sub === 'installment' ? <CaseDetailInstallmentBody data={data} /> : null}
    </View>
  );
}
