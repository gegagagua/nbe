import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { CaseFilters } from "@/components/cases/case-filters";
import { CaseList } from "@/components/cases/case-list";
import { CasePagination } from "@/components/cases/case-pagination";
import { AppHeader } from "@/components/ui/app-header";
import { useCaseApps } from "@/hooks/use-case-apps";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import type { CaseSearchFilters } from "@/types/case-management";
import { isCaseFiltersEmpty } from "@/utils/is-case-filters-empty";

export function CaseLoggedInScreen() {
  const { t } = useTranslation();
  const { scrollY, scrollHandler } = useScrollHeader();
  const [draftFilters, setDraftFilters] = useState<CaseSearchFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<CaseSearchFilters>({});
  const [pageNumber, setPageNumber] = useState(0);
  const query = useCaseApps(appliedFilters, pageNumber);
  // The case list endpoint already returns debtCategoryName + debtAmountDisplay,
  // so we render those directly instead of fetching a per-case demand summary.
  const items = query.data?.data ?? [];
  const page = query.data?.page;
  const totalPages = page?.totalPages ?? 1;
  const totalRecords = page?.totalRecords ?? 0;
  const emptyList = !query.isLoading && items.length === 0;
  const emptyNoProceedings = emptyList && isCaseFiltersEmpty(appliedFilters);

  const onSearch = () => {
    setPageNumber(0);
    setAppliedFilters(draftFilters);
  };
  const onClear = () => {
    setDraftFilters({});
    setAppliedFilters({});
    setPageNumber(0);
  };

  return (
    <View className="flex-1 bg-bg">
      <AppHeader
        title={t("cases.pageTitle")}
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
        <View className="gap-4">
          <CaseFilters
            values={draftFilters}
            onChange={setDraftFilters}
            onSearch={onSearch}
            onClear={onClear}
          />
          <View className="w-full">
            <CaseList
              items={items}
              loading={query.isLoading}
              empty={emptyList}
              emptyNoProceedings={emptyNoProceedings}
            />
            {!query.isLoading && items.length > 0 && (
              <CasePagination
                pageNumber={pageNumber}
                totalPages={totalPages}
                totalRecords={totalRecords}
                onPageChange={setPageNumber}
              />
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
