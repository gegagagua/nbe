import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { AppLocale } from '@/types/app-locale';
import { persistLocale } from '@/lib/locale-storage';

import { localeToggleStyles as s } from './locale-toggle.styles';

export function LocaleToggle() {
  const { t, i18n } = useTranslation();
  const active: AppLocale = i18n.language.startsWith('en') ? 'en' : 'ka';

  function setLocale(lng: AppLocale) {
    i18n.changeLanguage(lng);
    persistLocale(lng);
  }

  return (
    <View style={s.row} accessibilityRole="toolbar">
      <Pressable
        onPress={() => setLocale('ka')}
        style={[s.segment, active === 'ka' ? s.segmentActive : null]}
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'ka' }}
        accessibilityLabel={t('login.langKaA11y')}
      >
        <Text style={[s.label, active === 'ka' ? s.labelActive : null]}>KA</Text>
      </Pressable>
      <Pressable
        onPress={() => setLocale('en')}
        style={[s.segment, active === 'en' ? s.segmentActive : null]}
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'en' }}
        accessibilityLabel={t('login.langEnA11y')}
      >
        <Text style={[s.label, active === 'en' ? s.labelActive : null]}>EN</Text>
      </Pressable>
    </View>
  );
}
