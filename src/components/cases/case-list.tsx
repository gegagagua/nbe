import { Text, View } from 'react-native';

import { CaseManagementCopy } from '@/constants/case-management-copy';
import type { CaseListProps } from '@/types/case-management';

import { CaseListItem } from './case-list-item';
import { caseListStyles as s } from './case-list.styles';

export function CaseList({ items, loading, empty }: CaseListProps) {
  if (loading) {
    return <Text style={s.stateText}>{CaseManagementCopy.loadingMessage}</Text>;
  }

  if (empty) {
    return <Text style={s.stateText}>{CaseManagementCopy.emptyMessage}</Text>;
  }

  return (
    <View style={s.wrap}>
      {items.map((item) => (
        <CaseListItem key={item.id} item={item} />
      ))}
    </View>
  );
}
