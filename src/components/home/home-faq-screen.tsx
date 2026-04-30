import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { HomeTabsLayout, HomeTabsPalette } from '@/constants/home-tabs';
import type { HomeFaqItem } from '@/types/home-tabs';

import { homeFaqScreenStyles } from './home-faq-screen.styles';

export function HomeFaqScreen() {
  const { t, i18n } = useTranslation();
  const [expandedIdx, setExpandedIdx] = useState(0);
  const items = useMemo(
    () => t('homeFaq.items', { returnObjects: true }) as HomeFaqItem[],
    [t, i18n.language],
  );

  return (
    <ScrollView
      style={homeFaqScreenStyles.scroll}
      contentContainerStyle={homeFaqScreenStyles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <Text style={homeFaqScreenStyles.heading}>{t('homeTabs.faqTitle')}</Text>
      {items.map((item, index) => {
        const isExpanded = expandedIdx === index;
        return (
          <View key={item.question} style={homeFaqScreenStyles.card}>
            <Pressable
              style={homeFaqScreenStyles.trigger}
              onPress={() =>
                setExpandedIdx((prev) => (prev === index ? -1 : index))
              }
              accessibilityRole="button"
              accessibilityLabel={item.question}>
              <Text style={homeFaqScreenStyles.question}>{item.question}</Text>
              <MaterialCommunityIcons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={HomeTabsLayout.iconSize}
                color={HomeTabsPalette.inactiveText}
              />
            </Pressable>
            {isExpanded ? (
              <View style={homeFaqScreenStyles.answerWrap}>
                <Text style={homeFaqScreenStyles.answer}>{item.answer}</Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}
