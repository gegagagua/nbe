import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { AppHeader } from "@/components/ui/app-header";
import { useMarkNotificationsRead } from "@/hooks/use-mark-notifications-read";
import { useNotificationById } from "@/hooks/use-notifications";
import { useAppTheme } from "@/theme";

export function NotificationDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(rawId);

  const { notification, isLoading } = useNotificationById(id);
  const { markRead } = useMarkNotificationsRead();

  // Opening a notification counts as reading it.
  useEffect(() => {
    if (notification && !notification.isRead) {
      markRead([notification.id]);
    }
    // Only when the target notification (or its read state) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification?.id, notification?.isRead]);

  const openCase = () => {
    if (!notification) {
      return;
    }
    router.push({
      pathname: "/cases/[id]",
      params: { id: String(notification.appId) },
    });
  };

  return (
    <View className="flex-1 bg-bg">
      <AppHeader
        title={t("notifications.detailTitle")}
        onBack={() => router.back()}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Card>
            <View className="gap-3">
              <Skeleton height={14} width="40%" />
              <Skeleton height={20} width="80%" />
              <SkeletonText lines={4} />
            </View>
          </Card>
        ) : !notification ? (
          <EmptyState
            icon="bell-off-outline"
            title={t("notifications.detailNotFound")}
          />
        ) : (
          <Card>
            <View className="gap-2">
              <View className="flex-row items-center justify-between gap-2">
                <Text className="flex-1 text-caption text-fg-muted" numberOfLines={1}>
                  {notification.module}
                </Text>
                <Text className="text-caption text-fg-muted">
                  {notification.receivedAt}
                </Text>
              </View>
              <Text className="text-subtitle font-bold text-fg">
                {notification.title}
              </Text>
              <Text className="text-body-lg text-fg">{notification.body}</Text>

              {notification.caseNumber ? (
                <>
                  <View className="my-1 h-px bg-border" />
                  <Text className="text-label text-fg-muted">
                    {t("notifications.detailCaseLabel")}
                  </Text>
                  <PressableScale
                    className="flex-row items-center gap-1 self-start"
                    haptic="none"
                    onPress={openCase}
                    accessibilityRole="link"
                    accessibilityLabel={t("notifications.openCaseA11yLabel", {
                      caseNumber: notification.caseNumber,
                    })}
                  >
                    <Text className="text-body-lg font-bold text-accent underline">
                      {`#${notification.caseNumber}`}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={colors.accent}
                    />
                  </PressableScale>
                </>
              ) : null}
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
