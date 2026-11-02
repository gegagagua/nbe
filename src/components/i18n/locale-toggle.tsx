import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { AppLocale } from '@/types/app-locale';
import { persistLocale } from '@/lib/locale-storage';

export function LocaleToggle() {
  const { t, i18n } = useTranslation();
  const active: AppLocale = i18n.language.startsWith('en') ? 'en' : 'ka';

  function setLocale(lng: AppLocale) {
    i18n.changeLanguage(lng);
    persistLocale(lng);
  }

  return (
    <View
      className="flex-row rounded-sm border border-input-border overflow-hidden bg-input"
      accessibilityRole="toolbar">
      <Pressable
        onPress={() => setLocale('ka')}
        className={[
          'py-1 px-2 min-w-[36px] items-center justify-center',
          active === 'ka' ? 'bg-primary' : '',
        ].join(' ')}
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'ka' }}
        accessibilityLabel={t('login.langKaA11y')}>
        <Text
          className={[
            'text-label font-bold',
            active === 'ka' ? 'text-on-primary' : 'text-fg-secondary',
          ].join(' ')}>
          KA
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setLocale('en')}
        className={[
          'py-1 px-2 min-w-[36px] items-center justify-center',
          active === 'en' ? 'bg-primary' : '',
        ].join(' ')}
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'en' }}
        accessibilityLabel={t('login.langEnA11y')}>
        <Text
          className={[
            'text-label font-bold',
            active === 'en' ? 'text-on-primary' : 'text-fg-secondary',
          ].join(' ')}>
          EN
        </Text>
      </Pressable>
    </View>
  );
}
