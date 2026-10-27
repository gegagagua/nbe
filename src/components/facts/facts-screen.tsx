import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { CasePagination } from "@/components/cases/case-pagination";
import { AppHeader } from "@/components/ui";
import { useFactsApps } from "@/hooks/use-facts-apps";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import type { FactsSearchFilters } from "@/types/facts";

import { FactsList } from "./facts-list";
import { FactsMakeStatementCta } from "./facts-make-statement-cta";
import { FactsSearchForm } from "./facts-search-form";

export function FactsScreen() {
  const { t } = useTranslation();
  const { scrollY, scrollHandler } = useScrollHeader();
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
    <View className="flex-1 bg-bg">
      <AppHeader
        title={t("facts.pageTitle")}
        largeTitle
        scrollY={scrollY}
        onBack={() => router.back()}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3">
          <FactsMakeStatementCta />
          <FactsSearchForm
            values={draftFilters}
            onChange={setDraftFilters}
            onSearch={onSearch}
            onClear={onClear}
          />
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
      </Animated.ScrollView>
    </View>
  );
}
