import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { HomeSecondaryScreen } from '@/components/home/home-secondary-screen';

export function HomeContactScreen() {
  const { t, i18n } = useTranslation();
  const points = useMemo(
    () => t('homeTabs.contactPoints', { returnObjects: true }) as string[],
    [t, i18n.language],
  );

  return (
    <HomeSecondaryScreen
      title={t('homeTabs.contactTitle')}
      description={t('homeTabs.contactDescription')}
      points={points}
    />
  );
}
