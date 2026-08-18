import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { CasePagination } from "@/components/cases/case-pagination";
import { caseScreenStyles as s } from "@/components/cases/case-screen.styles";
import { HomeHeader } from "@/components/home/home-header";
import { LoginFooter } from "@/components/login/login-footer";
import { AppSafeArea } from "@/components/ui/app-safe-area";
import { useNotifications } from "@/hooks/use-notifications";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { isGuestMode } from "@/lib/guest-mode";
import type { NotificationFilterValue } from "@/types/notifications";

import { NotificationsFilter } from "./notifications-filter";
import { NotificationsList } from "./notifications-list";

export function NotificationsScreen() {
  const { t } = useTranslation();
  const { displayName } = useSessionUserProfile();
  const [readState, setReadState] = useState<NotificationFilterValue>("all");
  const [pageNumber, setPageNumber] = useState(0);
  const { data, isLoading } = useNotifications(pageNumber, { readState });

  const onReadStateChange = (next: NotificationFilterValue) => {
    setPageNumber(0);
    setReadState(next);
  };

  const items = data.data;
  const emptyList = !isLoading && items.length === 0;

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
          <View style={s.listWrap}>
            <NotificationsList
              items={items}
              loading={isLoading}
              empty={emptyList}
            />
            {!isLoading && items.length > 0 && data.totalPages > 1 && (
              <CasePagination
                pageNumber={pageNumber}
                totalPages={data.totalPages}
                totalRecords={data.totalRecords}
                onPageChange={setPageNumber}
              />
            )}
          </View>
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
