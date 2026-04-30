import { Text, View } from 'react-native';

import { CaseManagementCopy } from '@/constants/case-management-copy';
import type { CaseListProps } from '@/types/case-management';

import { CaseListItem } from './case-list-item';
import { caseListStyles as s } from './case-list.styles';

export function CaseList({ items, loading, empty, emptyNoProceedings }: CaseListProps) {
  if (loading) {
    return <Text style={s.stateText}>{CaseManagementCopy.loadingMessage}</Text>;
  }

  if (empty) {
    const msg = emptyNoProceedings
      ? CaseManagementCopy.emptyNoProceedingsMessage
      : CaseManagementCopy.emptyMessage;
    return <Text style={s.stateText}>{msg}</Text>;
  }

  return (
    <View style={s.wrap}>
      {items.map((item) => (
        <CaseListItem key={item.id} item={item} />
      ))}
    </View>
  );
}
