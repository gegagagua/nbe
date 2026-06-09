import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { readStoredLocale } from '@/lib/locale-storage';

export function I18nLocaleBootstrap() {
  const { i18n } = useTranslation();

  useEffect(() => {
    readStoredLocale().then((stored) => {
      if (!stored) return;
      if (i18n.language !== stored) i18n.changeLanguage(stored);
    });
  }, [i18n]);

  return null;
}
