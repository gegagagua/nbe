import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { CheckVerificationResult } from '@/types/users';

import { registerScreenBodyStyles as s } from './register-screen-body.styles';

type RegisterSuccessStepProps = {
  /** Verification-check payload; its top-level fields are listed on the card. */
  result?: CheckVerificationResult | null;
};

/** "firstName" → "First name", "id_number" → "Id number". */
function humanizeKey(key: string): string {
  const spaced = key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Primitives render as-is; objects/arrays are compact-stringified. */
function formatValue(value: unknown): string {
  if (value == null || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function RegisterSuccessStep({ result }: RegisterSuccessStepProps) {
  const { t } = useTranslation();
  const entries = result ? Object.entries(result) : [];

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.scrollContentCenter}>
      <View style={[s.card, s.successCard]}>
        <Text style={s.successIcon}>✓</Text>
        <Text style={s.successTitle}>{t('login.registerSuccessTitle')}</Text>
        <Text style={s.successMessage}>{t('login.registerSuccessMessage')}</Text>
        {entries.length > 0 ? (
          <View style={s.resultList}>
            {entries.map(([key, value], i) => (
              <View
                key={key}
                style={[
                  s.resultRow,
                  i === entries.length - 1 ? s.resultRowLast : null,
                ]}>
                <Text style={s.resultLabel}>{humanizeKey(key)}</Text>
                <Text style={s.resultValue}>{formatValue(value)}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <Pressable
          style={s.successButton}
          onPress={() => router.replace('/')}
          accessibilityRole="button">
          <Text style={s.successButtonText}>{t('login.registerSuccessButton')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
