import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { DebtorRegistryListProps } from '@/types/debtor-registry';

import { DebtorRegistryApplicationRow } from './debtor-registry-application-row';

export function DebtorRegistryApplicationList({
  items,
  loading,
  empty,
  emptyText,
}: DebtorRegistryListProps) {
  const { t } = useTranslation();
  if (loading) {
    return <Text className="text-body text-fg-secondary">{t('debtors.loadingMessage')}</Text>;
  }
  if (empty) {
    return (
      <Text className="text-body text-fg-secondary">
        {emptyText ?? t('debtors.emptyMessage')}
      </Text>
    );
  }
  return (
    <View className="gap-3">
      {items.map((app, index) => (
        <DebtorRegistryApplicationRow key={app.id} app={app} index={index} />
      ))}
    </View>
  );
}
