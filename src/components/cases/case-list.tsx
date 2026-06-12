import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseListProps } from '@/types/case-management';

import { CaseListItem } from './case-list-item';
import { caseListStyles as s } from './case-list.styles';

export function CaseList({ items, loading, empty, emptyNoProceedings }: CaseListProps) {
  const { t } = useTranslation();

  if (loading) {
    return <Text style={s.stateText}>{t('cases.loadingMessage')}</Text>;
  }

  if (empty) {
    const msg = emptyNoProceedings
      ? t('cases.emptyNoProceedingsMessage')
      : t('cases.emptyMessage');
    return <Text style={s.stateText}>{msg}</Text>;
  }

  return (
    <View style={s.wrap}>
      {items.map((item, index) => (
        <CaseListItem key={item.id} item={item} index={index} />
      ))}
    </View>
  );
}
