import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { factsDetailStyles as s } from "./facts-detail.styles";

export type FactsDetailTab = "application" | "protocol";

type Props = {
  value: FactsDetailTab;
  onChange: (v: FactsDetailTab) => void;
};

export function FactsDetailTabs({ value, onChange }: Props) {
  const { t } = useTranslation();
  const items: { key: FactsDetailTab; label: string }[] = [
    { key: "application", label: t("facts.detailTabApplication") },
    { key: "protocol", label: t("facts.detailTabProtocol") },
  ];
  return (
    <View style={s.tabBar} accessibilityRole="tablist">
      {items.map((it) => {
        const active = value === it.key;
        return (
          <Pressable
            key={it.key}
            style={[s.tab, active && s.tabActive]}
            onPress={() => onChange(it.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={[s.tabLabel, active && s.tabLabelActive]}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
