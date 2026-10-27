import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppTheme } from '@/theme';
import type { CheckVerificationResult } from '@/types/users';

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
  const { colors } = useAppTheme();
  const entries = result ? Object.entries(result) : [];

  return (
    <ScrollView
      className="w-full max-w-[420px] flex-1 self-stretch"
      contentContainerClassName="grow justify-center pb-4">
      <Card padding="lg" elevation="lg" className="w-full items-center gap-4 self-center rounded-2xl">
        <MaterialCommunityIcons name="check-circle" size={48} color={colors.success} />
        <Text className="text-center text-title font-bold text-success">
          {t('login.registerSuccessTitle')}
        </Text>
        <Text className="text-center text-body leading-[22px] text-fg-secondary">
          {t('login.registerSuccessMessage')}
        </Text>
        {entries.length > 0 ? (
          <View className="self-stretch overflow-hidden rounded-sm border border-border">
            {entries.map(([key, value], i) => (
              <View
                key={key}
                className={`flex-row items-start justify-between gap-4 px-4 py-2 ${
                  i === entries.length - 1 ? '' : 'border-b border-border'
                }`}>
                <Text className="flex-1 text-caption text-fg-secondary">{humanizeKey(key)}</Text>
                <Text className="flex-1 text-right text-caption font-bold text-fg">
                  {formatValue(value)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        <View className="mt-1 self-stretch">
          <Button
            label={t('login.registerSuccessButton')}
            onPress={() => router.replace('/')}
          />
        </View>
      </Card>
    </ScrollView>
  );
}
