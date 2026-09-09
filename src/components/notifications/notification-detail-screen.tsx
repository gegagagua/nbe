import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { caseScreenStyles as s } from "@/components/cases/case-screen.styles";
import { HomeHeader } from "@/components/home/home-header";
import { LoginFooter } from "@/components/login/login-footer";
import { AppSafeArea } from "@/components/ui/app-safe-area";
import { useMarkNotificationsRead } from "@/hooks/use-mark-notifications-read";
import { useNotificationById } from "@/hooks/use-notifications";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { isGuestMode } from "@/lib/guest-mode";

import { notificationDetailStyles as d } from "./notification-detail-screen.styles";

export function NotificationDetailScreen() {
  const { t } = useTranslation();
  const { displayName } = useSessionUserProfile();
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
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <HomeHeader displayName={isGuestMode() ? "" : displayName} />
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator
        >
          <View style={s.titleRow}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={t("notifications.backA11yLabel")}
              style={s.backButton}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={22}
                color="#2b436c"
              />
            </Pressable>
            <Text style={s.title}>{t("notifications.detailTitle")}</Text>
          </View>

          {!notification ? (
            <Text style={d.stateText}>
              {isLoading
                ? t("notifications.loadingMessage")
                : t("notifications.detailNotFound")}
            </Text>
          ) : (
            <View style={d.card}>
              <View style={d.metaRow}>
                <Text style={d.module} numberOfLines={1}>
                  {notification.module === "other"
                    ? ""
                    : t(`notifications.modules.${notification.module}`)}
                </Text>
                <Text style={d.date}>{notification.receivedAt}</Text>
              </View>
              <Text style={d.title}>{notification.title}</Text>
              <Text style={d.body}>{notification.body}</Text>

              {notification.caseNumber ? (
                <>
                  <View style={d.divider} />
                  <Text style={d.caseLabel}>
                    {t("notifications.detailCaseLabel")}
                  </Text>
                  <Pressable
                    style={d.caseLink}
                    onPress={openCase}
                    accessibilityRole="link"
                    accessibilityLabel={t("notifications.openCaseA11yLabel", {
                      caseNumber: notification.caseNumber,
                    })}
                  >
                    <Text style={d.caseLinkText}>
                      {`#${notification.caseNumber}`}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#2b436c"
                    />
                  </Pressable>
                </>
              ) : null}
            </View>
          )}
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
