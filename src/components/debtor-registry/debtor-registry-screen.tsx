import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";

import { DebtorAppList } from "@/components/debtor-registry/debtor-app-list";
import { DebtorRegistryFilters } from "@/components/debtor-registry/debtor-registry-filters";
import { HomeHeader } from "@/components/home/home-header";
import { LoginFooter } from "@/components/login/login-footer";
import { AppSafeArea } from "@/components/ui/app-safe-area";
import { UnreadCountBadge } from "@/components/ui/unread-count-badge";
import { DebtorRegistryCopy } from "@/constants/debtor-registry-copy";
import { useDebtorApps } from "@/hooks/use-debtor-apps";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { useUnreadNotificationsCount } from "@/hooks/use-unread-notifications-count";
import type { DebtorSearchFilters } from "@/types/debtor-registry";

import { debtorRegistryScreenStyles as s } from "./debtor-registry-screen.styles";

const initialFilters: DebtorSearchFilters = {};

export function DebtorRegistryScreen() {
  const { displayName } = useSessionUserProfile();
  const { count, isLoading } = useUnreadNotificationsCount();
  const [draftFilters, setDraftFilters] =
    useState<DebtorSearchFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<DebtorSearchFilters>(initialFilters);
  const [pageNumber, setPageNumber] = useState(0);
  const query = useDebtorApps(appliedFilters, pageNumber);
  const items = query.data?.data ?? [];
  const page = query.data?.page;
  const totalPages = page?.totalPages ?? 1;
  const disablePrev = pageNumber <= 0;
  const disableNext = pageNumber + 1 >= totalPages;

  const onSearch = () => {
    setPageNumber(0);
    setAppliedFilters(draftFilters);
  };

  const onClear = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPageNumber(0);
  };

  return (
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <HomeHeader displayName={displayName} />
        <ScrollView
          style={s.contentScroll}
          contentContainerStyle={s.contentWrap}
        >
          <View style={s.titleRow}>
            <Text style={s.titleText}>{DebtorRegistryCopy.pageTitle}</Text>
            <View style={s.notifWrap}>
              <Text style={s.notifText}>
                {DebtorRegistryCopy.notifications}
              </Text>
              <UnreadCountBadge count={count} loading={isLoading} />
            </View>
          </View>
          <View
            style={[s.contentRow, Platform.OS === "web" && s.contentRowWeb]}
          >
            <DebtorRegistryFilters
              values={draftFilters}
              onChange={setDraftFilters}
              onSearch={onSearch}
              onClear={onClear}
            />
            <View style={s.listWrap}>
              <DebtorAppList
                items={items}
                loading={query.isLoading}
                empty={!query.isLoading && items.length === 0}
              />
              {!query.isLoading && items.length > 0 && (
                <View style={s.pagination}>
                  <Pressable
                    style={[s.pageButton, disablePrev && s.pageButtonDisabled]}
                    onPress={() =>
                      setPageNumber((curr) => Math.max(curr - 1, 0))
                    }
                    disabled={disablePrev}
                  >
                    <Text style={s.pageButtonText}>
                      {DebtorRegistryCopy.previousPage}
                    </Text>
                  </Pressable>
                  <Text style={s.pageText}>
                    {pageNumber + 1} / {Math.max(totalPages, 1)}
                  </Text>
                  <Pressable
                    style={[s.pageButton, disableNext && s.pageButtonDisabled]}
                    onPress={() => setPageNumber((curr) => curr + 1)}
                    disabled={disableNext}
                  >
                    <Text style={s.pageButtonText}>
                      {DebtorRegistryCopy.nextPage}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
