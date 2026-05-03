import { useState } from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';
import { CaseDetailAgencyAccordion } from './case-detail-agency-accordion';
import { CaseDetailBusinessTables } from './case-detail-business-tables';
import { CaseDetailMiaSearchBlock } from './case-detail-mia-search-block';
import { CaseDetailSocialTable } from './case-detail-social-table';

type AgencyKey = 'miaC' | 'miaD' | 'soc' | 'reg' | 'biz';

export function CaseDetailSearchTab({ data }: { data: CaseDetailLayoutMock }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<AgencyKey | null>('miaD');
  const toggle = (k: AgencyKey) => setOpen((v) => (v === k ? null : k));
  return (
    <>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencyMiaCreditor')}
        open={open === 'miaC'}
        onToggle={() => toggle('miaC')}>
        <CaseDetailMiaSearchBlock block={data.searchMiaCreditor} />
      </CaseDetailAgencyAccordion>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencyMiaDebtor')}
        open={open === 'miaD'}
        onToggle={() => toggle('miaD')}>
        <CaseDetailMiaSearchBlock block={data.searchMiaDebtor} />
      </CaseDetailAgencyAccordion>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencySocial')}
        open={open === 'soc'}
        onToggle={() => toggle('soc')}>
        <CaseDetailSocialTable rows={data.socialRows} />
      </CaseDetailAgencyAccordion>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencyRegistry')}
        open={open === 'reg'}
        onToggle={() => toggle('reg')}>
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.searchRegistryPlaceholder')}</Text>
      </CaseDetailAgencyAccordion>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencyBusiness')}
        open={open === 'biz'}
        onToggle={() => toggle('biz')}>
        <CaseDetailBusinessTables notify={data.businessNotify} shares={data.businessShares} />
      </CaseDetailAgencyAccordion>
    </>
  );
}
