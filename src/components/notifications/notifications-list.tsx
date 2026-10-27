import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { AppNotification } from "@/types/notifications";

import { NotificationListItem } from "./notification-list-item";

export function NotificationsList({
  items,
  loading,
  empty,
  selectedIds,
  onToggleSelected,
  onItemPress,
}: {
  items: AppNotification[];
  loading: boolean;
  empty: boolean;
  selectedIds: Set<number>;
  onToggleSelected: (id: number) => void;
  onItemPress: (item: AppNotification) => void;
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View className="gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} height={84} radius={16} />
        ))}
      </View>
    );
  }

  if (empty) {
    return (
      <EmptyState
        icon="bell-outline"
        title={t("notifications.emptyMessage")}
      />
    );
  }

  return (
    <View className="gap-3">
      {items.map((item) => (
        <NotificationListItem
          key={item.id}
          item={item}
          selected={selectedIds.has(item.id)}
          onToggleSelected={onToggleSelected}
          onPress={onItemPress}
        />
      ))}
    </View>
  );
}
