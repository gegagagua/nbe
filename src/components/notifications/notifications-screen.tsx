import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { CasePagination } from "@/components/cases/case-pagination";
import { caseScreenStyles as s } from "@/components/cases/case-screen.styles";
import { HomeHeader } from "@/components/home/home-header";
import { LoginFooter } from "@/components/login/login-footer";
import { AppSafeArea } from "@/components/ui/app-safe-area";
import { useMarkNotificationsRead } from "@/hooks/use-mark-notifications-read";
import { useNotifications } from "@/hooks/use-notifications";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { isGuestMode } from "@/lib/guest-mode";
import type {
  AppNotification,
  NotificationFilterValue,
  NotificationSelectPreset,
} from "@/types/notifications";

import { NotificationsFilter } from "./notifications-filter";
import { NotificationsList } from "./notifications-list";
import { NotificationsToolbar } from "./notifications-toolbar";

export function NotificationsScreen() {
  const { t } = useTranslation();
  const { displayName } = useSessionUserProfile();
  const [readState, setReadState] = useState<NotificationFilterValue>("all");
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { data, isLoading } = useNotifications(pageNumber, { readState });
  const { markRead, markAllRead, isPending } = useMarkNotificationsRead();

  const items = data.data;
  const emptyList = !isLoading && items.length === 0;

  const onReadStateChange = (next: NotificationFilterValue) => {
    setPageNumber(0);
    setSelectedIds(new Set());
    setReadState(next);
  };

  const onPageChange = (next: number) => {
    setSelectedIds(new Set());
    setPageNumber(next);
  };

  const onToggleSelected = useCallback((id: number) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const onSelectPreset = (preset: NotificationSelectPreset) => {
    if (preset === "none") {
      setSelectedIds(new Set());
      return;
    }
    const matching = items.filter((item) => {
      if (preset === "read") {
        return item.isRead;
      }
      if (preset === "unread") {
        return !item.isRead;
      }
      return true;
    });
    setSelectedIds(new Set(matching.map((item) => item.id)));
  };

  const onItemPress = (item: AppNotification) => {
    // Mark read immediately for snappy feedback; the detail screen also does
    // this on open, but doing it here updates the list right away.
    if (!item.isRead) {
      markRead([item.id]);
    }
    router.push({
      pathname: "/notifications/[id]",
      params: { id: String(item.id) },
    });
  };

  const onMarkSelectedRead = () => {
    markRead([...selectedIds]);
    setSelectedIds(new Set());
  };

  const onMarkAllRead = () => {
    markAllRead();
    setSelectedIds(new Set());
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
            <Text style={s.title}>{t("notifications.pageTitle")}</Text>
          </View>
          <NotificationsFilter value={readState} onChange={onReadStateChange} />
          {!isLoading && items.length > 0 && (
            <NotificationsToolbar
              selectedCount={selectedIds.size}
              allSelected={selectedIds.size === items.length}
              onSelectPreset={onSelectPreset}
              onMarkSelectedRead={onMarkSelectedRead}
              onMarkAllRead={onMarkAllRead}
              busy={isPending}
            />
          )}
          <View style={s.listWrap}>
            <NotificationsList
              items={items}
              loading={isLoading}
              empty={emptyList}
              selectedIds={selectedIds}
              onToggleSelected={onToggleSelected}
              onItemPress={onItemPress}
            />
            {!isLoading && items.length > 0 && data.totalPages > 1 && (
              <CasePagination
                pageNumber={pageNumber}
                totalPages={data.totalPages}
                totalRecords={data.totalRecords}
                onPageChange={onPageChange}
              />
            )}
          </View>
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
