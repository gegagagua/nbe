import { View } from 'react-native';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { CaseDetailClaimsSection } from './case-detail-claims-section';
import { CaseDetailCreditorsSection } from './case-detail-creditors-section';
import { CaseDetailDebtorsSection } from './case-detail-debtors-section';
import { CaseDetailWritSection } from './case-detail-writ-section';

export function CaseDetailApplicationTab({ data }: { data: CaseDetailLayoutMock }) {
  return (
    <View>
      <CaseDetailCreditorsSection creditors={data.creditors} />
      <CaseDetailDebtorsSection debtors={data.debtors} />
      <CaseDetailWritSection writRows={data.writRows} />
      <CaseDetailClaimsSection claimsSummary={data.claimsSummary} claimRows={data.claimRows} />
    </View>
  );
}
