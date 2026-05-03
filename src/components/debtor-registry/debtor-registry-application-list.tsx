import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { DebtorRegistryListProps } from '@/types/debtor-registry';

import { debtorRegistryApplicationListStyles as s } from './debtor-registry-application-list.styles';
import { DebtorRegistryApplicationRow } from './debtor-registry-application-row';

export function DebtorRegistryApplicationList({
  items,
  loading,
  empty,
}: DebtorRegistryListProps) {
  const { t } = useTranslation();
  if (loading) {
    return <Text style={s.state}>{t('debtors.loadingMessage')}</Text>;
  }
  if (empty) {
    return <Text style={s.state}>{t('debtors.emptyMessage')}</Text>;
  }
  return (
    <View style={s.list}>
      {items.map((app) => (
        <DebtorRegistryApplicationRow key={app.id} app={app} />
      ))}
    </View>
  );
}
