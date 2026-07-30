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
import { useFactsApps } from "@/hooks/use-facts-apps";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { isGuestMode } from "@/lib/guest-mode";
import type { FactsSearchFilters } from "@/types/facts";

import { FactsList } from "./facts-list";
import { FactsSearchForm } from "./facts-search-form";

export function FactsScreen() {
  const { t } = useTranslation();
  const { displayName } = useSessionUserProfile();
  const [draftFilters, setDraftFilters] = useState<FactsSearchFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<FactsSearchFilters>({});
  const [pageNumber, setPageNumber] = useState(0);
  const { data, isLoading } = useFactsApps(pageNumber, appliedFilters);

  const onSearch = () => {
    setPageNumber(0);
    setAppliedFilters(draftFilters);
  };
  const onClear = () => {
    setDraftFilters({});
    setAppliedFilters({});
    setPageNumber(0);
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
              accessibilityLabel={t("facts.backA11yLabel")}
              style={s.backButton}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={22}
                color="#2b436c"
              />
            </Pressable>
            <Text style={s.title}>{t("facts.pageTitle")}</Text>
          </View>
          <FactsSearchForm
            values={draftFilters}
            onChange={setDraftFilters}
            onSearch={onSearch}
            onClear={onClear}
          />
          <View style={s.listWrap}>
            <FactsList items={items} loading={isLoading} empty={emptyList} />
            {!isLoading && items.length > 0 && (
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
