import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

export function DebtorRegistryExtractCta() {
  const { t } = useTranslation();
  return (
    <Button
      label={t('debtors.extractRequestButton')}
      size="lg"
      onPress={() => router.push('/debtors/extract-request')}
    />
  );
}
