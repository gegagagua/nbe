import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import {
    HomeFaqItems,
    HomeTabsCopy,
    HomeTabsLayout,
    HomeTabsPalette,
} from "@/constants/home-tabs";

import { homeFaqScreenStyles } from "./home-faq-screen.styles";

export function HomeFaqScreen() {
  const [expandedIdx, setExpandedIdx] = useState(0);

  return (
    <ScrollView
      style={homeFaqScreenStyles.scroll}
      contentContainerStyle={homeFaqScreenStyles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={homeFaqScreenStyles.heading}>{HomeTabsCopy.faqTitle}</Text>
      {HomeFaqItems.map((item, index) => {
        const isExpanded = expandedIdx === index;
        return (
          <View key={item.question} style={homeFaqScreenStyles.card}>
            <Pressable
              style={homeFaqScreenStyles.trigger}
              onPress={() =>
                setExpandedIdx((prev) => (prev === index ? -1 : index))
              }
              accessibilityRole="button"
              accessibilityLabel={item.question}
            >
              <Text style={homeFaqScreenStyles.question}>{item.question}</Text>
              <MaterialCommunityIcons
                name={isExpanded ? "chevron-up" : "chevron-down"}
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
