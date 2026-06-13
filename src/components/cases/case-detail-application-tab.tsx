import { View } from 'react-native';

import type { CaseDetailData } from '@/types/case-detail-data';

import { CaseDetailClaimsSection } from './case-detail-claims-section';
import { CaseDetailCreditorsSection } from './case-detail-creditors-section';
import { CaseDetailDebtorsSection } from './case-detail-debtors-section';
import { CaseDetailWritSection } from './case-detail-writ-section';

export function CaseDetailApplicationTab({ data }: { data: CaseDetailData }) {
  return (
    <View>
      <CaseDetailCreditorsSection creditors={data.creditors} />
      <CaseDetailDebtorsSection debtors={data.debtors} />
      <CaseDetailWritSection writRows={data.writRows} />
      <CaseDetailClaimsSection claimsSummary={data.claimsSummary} claimRows={data.claimRows} />
    </View>
  );
}
