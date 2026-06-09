import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '@/locales/en';
import { ka } from '@/locales/ka';
import type { AppLocale } from '@/types/app-locale';

function deviceLocale(): AppLocale {
  const code = Localization.getLocales()?.[0]?.languageCode?.toLowerCase() ?? 'ka';
  return code.startsWith('en') ? 'en' : 'ka';
}

const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    ka: { translation: ka },
    en: { translation: en },
  },
  lng: deviceLocale(),
  fallbackLng: 'ka',
  interpolation: { escapeValue: false },
});

export default i18n;
