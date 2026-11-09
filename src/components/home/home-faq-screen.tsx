import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useFaqs } from '@/hooks/use-faqs';
import { groupFaqsByCategory } from '@/lib/map-faqs';
import { useAppTheme } from '@/theme';
import type { FaqItem } from '@/types/faq';
import type { HomeFaqItem } from '@/types/home-tabs';

export function HomeFaqScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useAppTheme();
  const { data: apiItems, isPending } = useFaqs();

  // Curated, bundled list used as a fallback so the page is never blank when
  // the backend is unreachable or has no entries yet. Negative ids keep the
  // expand keys distinct from the live rows.
  const bundled = useMemo<FaqItem[]>(
    () =>
      (t('homeFaq.items', { returnObjects: true }) as HomeFaqItem[]).map(
        (item, index) => ({
          id: -1 - index,
          question: item.question,
          answer: item.answer,
          categoryId: null,
          categoryName: '',
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language],
  );

  // Prefer the live FAQ; fall back to the bundled list when it's empty.
  const items = apiItems && apiItems.length > 0 ? apiItems : bundled;
  const groups = useMemo(() => groupFaqsByCategory(items), [items]);
  const showCategoryHeaders =
    groups.length > 1 || Boolean(groups[0]?.categoryName);

  const firstKey = items[0] ? String(items[0].id) : '';
  // null = untouched (first row open by default); '' = all collapsed.
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const openKey = expandedKey ?? firstKey;

  const toggle = (key: string) =>
    setExpandedKey((prev) => {
      const current = prev ?? firstKey;
      return current === key ? '' : key;
    });

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 32, marginTop: 16, gap: 8 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <Text className="mb-1 text-title font-bold text-fg">{t('homeTabs.faqTitle')}</Text>

      {isPending ? (
        <ActivityIndicator className="mt-6" color={colors.primary} />
      ) : (
        groups.map((group) => (
          <View key={group.categoryId ?? 'uncategorized'} className="gap-2">
            {showCategoryHeaders && group.categoryName ? (
              <Text className="mt-2 text-body-lg font-bold text-fg-secondary">
                {group.categoryName}
              </Text>
            ) : null}
            {group.items.map((item) => {
              const key = String(item.id);
              const isExpanded = openKey === key;
              return (
                <View
                  key={key}
                  className="overflow-hidden rounded-lg border border-border bg-surface">
                  <Pressable
                    className="flex-row items-center justify-between gap-2 px-4 py-3"
                    onPress={() => toggle(key)}
                    accessibilityRole="button"
                    accessibilityLabel={item.question}>
                    <Text className="flex-1 text-body-lg font-semibold text-fg">
                      {item.question}
                    </Text>
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
          </View>
        ))
      )}
    </ScrollView>
  );
}
