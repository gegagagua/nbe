import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { HomeSecondaryScreen } from '@/components/home/home-secondary-screen';

export function HomeChatScreen() {
  const { t, i18n } = useTranslation();
  const points = useMemo(
    () => t('homeTabs.chatPoints', { returnObjects: true }) as string[],
    [t, i18n.language],
  );

  return (
    <HomeSecondaryScreen
      title={t('homeTabs.chatTitle')}
      description={t('homeTabs.chatDescription')}
      points={points}
    />
  );
}
