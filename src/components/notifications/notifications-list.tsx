import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { caseListStyles } from "@/components/cases/case-list.styles";
import { NotificationsLayout } from "@/constants/notifications";
import type { AppNotification } from "@/types/notifications";

import { NotificationListItem } from "./notification-list-item";

const styles = StyleSheet.create({
  wrap: { gap: NotificationsLayout.listGap },
});

export function NotificationsList({
  items,
  loading,
  empty,
  onItemPress,
}: {
  items: AppNotification[];
  loading: boolean;
  empty: boolean;
  onItemPress?: (item: AppNotification) => void;
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Text style={caseListStyles.stateText}>
        {t("notifications.loadingMessage")}
      </Text>
    );
  }

  if (empty) {
    return (
      <Text style={caseListStyles.stateText}>
        {t("notifications.emptyMessage")}
      </Text>
    );
  }

  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <NotificationListItem
          key={item.id}
          item={item}
          onPress={onItemPress}
        />
      ))}
    </View>
  );
}
