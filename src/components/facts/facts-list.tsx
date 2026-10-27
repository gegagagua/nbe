import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Card, EmptyState, Skeleton, SkeletonText } from "@/components/ui";
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
    return (
      <View className="gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <View className="gap-3">
              <Skeleton height={14} width="40%" />
              <SkeletonText lines={2} />
            </View>
          </Card>
        ))}
      </View>
    );
  }

  if (empty) {
    return <EmptyState icon="file-search-outline" title={t("facts.emptyMessage")} />;
  }

  return (
    <View className="gap-3">
      {items.map((item, index) => (
        <FactsListItem key={item.id} item={item} index={index} />
      ))}
    </View>
  );
}
