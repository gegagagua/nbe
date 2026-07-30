import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { caseListStyles as s } from "@/components/cases/case-list.styles";
import type { FactApplication } from "@/types/facts";

import { FactsListItem } from "./facts-list-item";

export function FactsList({
  items,
  loading,
  empty,
}: {
  items: FactApplication[];
  loading: boolean;
  empty: boolean;
}) {
  const { t } = useTranslation();

  if (loading) {
    return <Text style={s.stateText}>{t("facts.loadingMessage")}</Text>;
  }

  if (empty) {
    return <Text style={s.stateText}>{t("facts.emptyMessage")}</Text>;
  }

  return (
    <View style={s.wrap}>
      {items.map((item, index) => (
        <FactsListItem key={item.id} item={item} index={index} />
      ))}
    </View>
  );
}
