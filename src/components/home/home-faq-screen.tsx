import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/theme';
import type { HomeFaqItem } from '@/types/home-tabs';

export function HomeFaqScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useAppTheme();
  const [expandedIdx, setExpandedIdx] = useState(0);
  const items = useMemo(
    () => t('homeFaq.items', { returnObjects: true }) as HomeFaqItem[],
    [t, i18n.language],
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 32, marginTop: 16, gap: 8 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <Text className="mb-1 text-title font-bold text-fg">{t('homeTabs.faqTitle')}</Text>
      {items.map((item, index) => {
        const isExpanded = expandedIdx === index;
        return (
          <View
            key={item.question}
            className="overflow-hidden rounded-lg border border-border bg-surface">
            <Pressable
              className="flex-row items-center justify-between gap-2 px-4 py-3"
              onPress={() =>
                setExpandedIdx((prev) => (prev === index ? -1 : index))
              }
              accessibilityRole="button"
              accessibilityLabel={item.question}>
              <Text className="flex-1 text-body-lg font-semibold text-fg">{item.question}</Text>
              <MaterialCommunityIcons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.text}
              />
            </Pressable>
            {isExpanded ? (
              <View className="bg-surface-sunken px-4 pb-4 pt-1">
                <Text className="text-body-lg text-fg-secondary">{item.answer}</Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}
