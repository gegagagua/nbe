import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { PressableScale } from "@/components/ui";

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
    <View
      className="flex-row gap-1 rounded-lg border border-border bg-surface-sunken p-1"
      accessibilityRole="tablist"
    >
      {items.map((it) => {
        const active = value === it.key;
        return (
          <PressableScale
            key={it.key}
            className={`flex-1 items-center rounded-md py-2 ${active ? "bg-surface" : ""}`}
            onPress={() => onChange(it.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              className={`text-label ${active ? "font-bold text-fg" : "text-fg-secondary"}`}
            >
              {it.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
