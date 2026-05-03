import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailBusinessTables({
  notify,
  shares,
}: {
  notify: CaseDetailLayoutMock['businessNotify'];
  shares: CaseDetailLayoutMock['businessShares'];
}) {
  const { t } = useTranslation();
  return (
    <View>
      <Text style={tb.subSectionTitle}>{t('cases.detail.businessNotifyTitle')}</Text>
      <View style={tb.tableHead}>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColDebtor')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColInitiator')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColCreated')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColSent')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColResponse')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColIe')}</Text>
      </View>
      {notify.map((row) => (
        <View key={row.createdAt + row.debtor} style={tb.tableRow}>
          <Text style={tb.tableCell}>{row.debtor}</Text>
          <Text style={tb.tableCell}>{row.initiator}</Text>
          <Text style={tb.tableCell}>{row.createdAt}</Text>
          <Text style={tb.tableCell}>{row.sent}</Text>
          <Text style={tb.tableCell}>{row.response}</Text>
          <Text style={tb.tableCell}>{row.soleProp}</Text>
        </View>
      ))}
      <Text style={tb.subSectionTitle}>{t('cases.detail.businessSharesTitle')}</Text>
      <View style={tb.tableHead}>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColOwner')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColTitle')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColOrgNo')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColRegDate')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColShare')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColStatus')}</Text>
      </View>
      {shares.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        shares.map((row) => (
          <View key={row.orgNo + row.owner} style={tb.tableRow}>
            <Text style={tb.tableCell}>{row.owner}</Text>
            <Text style={tb.tableCell}>{row.title}</Text>
            <Text style={tb.tableCell}>{row.orgNo}</Text>
            <Text style={tb.tableCell}>{row.regDate}</Text>
            <Text style={tb.tableCell}>{row.share}</Text>
            <Text style={tb.tableCell}>{row.status}</Text>
          </View>
        ))
      )}
    </View>
  );
}
