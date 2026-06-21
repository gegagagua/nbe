import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CaseDetailAgencyAccordion } from './case-detail-agency-accordion';
import { CaseDetailBusinessTables } from './case-detail-business-tables';
import { CaseDetailMiaSearchBlock } from './case-detail-mia-search-block';
import { CaseDetailRegistryTables } from './case-detail-registry-tables';
import { CaseDetailSocialTable } from './case-detail-social-table';

type AgencyKey = 'miaC' | 'miaD' | 'soc' | 'reg' | 'biz';

export function CaseDetailSearchTab() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<AgencyKey | null>('miaD');
  const toggle = (k: AgencyKey) => setOpen((v) => (v === k ? null : k));
  return (
    <>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencyMiaCreditor')}
        open={open === 'miaC'}
        onToggle={() => toggle('miaC')}>
        <CaseDetailMiaSearchBlock appPersonTypeId={1} />
      </CaseDetailAgencyAccordion>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencyMiaDebtor')}
        open={open === 'miaD'}
        onToggle={() => toggle('miaD')}>
        <CaseDetailMiaSearchBlock appPersonTypeId={2} />
      </CaseDetailAgencyAccordion>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencySocial')}
        open={open === 'soc'}
        onToggle={() => toggle('soc')}>
        <CaseDetailSocialTable />
      </CaseDetailAgencyAccordion>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencyRegistry')}
        open={open === 'reg'}
        onToggle={() => toggle('reg')}>
        <CaseDetailRegistryTables />
      </CaseDetailAgencyAccordion>
      <CaseDetailAgencyAccordion
        title={t('cases.detail.agencyBusiness')}
        open={open === 'biz'}
        onToggle={() => toggle('biz')}>
        <CaseDetailBusinessTables />
      </CaseDetailAgencyAccordion>
    </>
  );
}
