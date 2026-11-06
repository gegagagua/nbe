import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseListProps } from '@/types/case-management';

import { CaseListItem } from './case-list-item';

export function CaseList({ items, loading, empty, emptyNoProceedings }: CaseListProps) {
  const { t } = useTranslation();

  if (loading) {
    return <Text className="text-body text-fg-secondary">{t('cases.loadingMessage')}</Text>;
  }

  if (empty) {
    const msg = emptyNoProceedings
      ? t('cases.emptyNoProceedingsMessage')
      : t('cases.emptyMessage');
    return <Text className="text-body text-fg-secondary">{msg}</Text>;
  }

  return (
    <View className="w-full gap-2">
      {items.map((item, index) => (
        <CaseListItem key={item.id} item={item} index={index} />
      ))}
    </View>
  );
}
