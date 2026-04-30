import { useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { DebtorRegistryListProps } from '@/types/debtor-registry';

import { DebtorAppDetailsModal } from './debtor-app-details-modal';
import { DebtorAppListItem } from './debtor-app-list-item';
import { debtorAppListStyles as s } from './debtor-app-list.styles';

export function DebtorAppList({ items, loading, empty }: DebtorRegistryListProps) {
  const { t } = useTranslation();
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const selectedApp = items.find((item) => item.id === selectedAppId) ?? null;

  if (loading) {
    return <Text style={s.stateText}>{t('debtors.loadingMessage')}</Text>;
  }

  if (empty) {
    return <Text style={s.stateText}>{t('debtors.emptyMessage')}</Text>;
  }

  return (
    <View style={s.wrap}>
      {items.map((item) => (
        <DebtorAppListItem key={item.id} app={item} onPress={(app) => setSelectedAppId(app.id)} />
      ))}
      <DebtorAppDetailsModal app={selectedApp} onClose={() => setSelectedAppId(null)} />
    </View>
  );
}
