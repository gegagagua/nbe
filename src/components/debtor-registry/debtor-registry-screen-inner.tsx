import { router } from "expo-router";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/ui/app-header";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { isGuestMode } from "@/lib/guest-mode";
import type {
  DebtorRegistryApplication,
  DebtorRegistryPage,
} from "@/types/debtor-registry";

import { DebtorRegistryApplicationList } from "./debtor-registry-application-list";
import { DebtorRegistryExtractCta } from "./debtor-registry-extract-cta";

type Props = {
  displayName: string;
  items: DebtorRegistryApplication[];
  loading: boolean;
  empty: boolean;
  listEmptyText?: string;
  searchForm?: ReactNode;
  pageInfo: DebtorRegistryPage | undefined;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

export function DebtorRegistryScreenInner({
  items,
  loading,
  empty,
  listEmptyText,
  searchForm,
  pageInfo,
  page,
  setPage,
}: Props) {
  const { t } = useTranslation();
  const { scrollY, scrollHandler } = useScrollHeader();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg">
      <AppHeader
        title={t("debtors.pageTitle")}
        largeTitle
        scrollY={scrollY}
        onBack={() => router.back()}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          {searchForm}
          {!isGuestMode() ? (
            <View className="flex-1">
              <DebtorRegistryApplicationList
                items={items}
                loading={loading}
                empty={empty}
                emptyText={listEmptyText}
              />
            </View>
          ) : null}
          {pageInfo && pageInfo.totalPages > 1 ? (
            <View className="mt-2 flex-row items-center justify-between">
              <Pressable
                className={`h-[34px] min-w-[86px] items-center justify-center rounded-sm border border-input-border bg-input ${
                  page <= 0 ? "opacity-45" : ""
                }`}
                disabled={page <= 0}
                onPress={() => setPage((p) => Math.max(0, p - 1))}
              >
                <Text className="text-label font-bold text-fg">
                  {t("debtors.previousPage")}
                </Text>
              </Pressable>
              <Text className="text-label font-semibold text-fg">
                {page + 1} / {pageInfo.totalPages}
              </Text>
              <Pressable
                className={`h-[34px] min-w-[86px] items-center justify-center rounded-sm border border-input-border bg-input ${
                  page >= pageInfo.totalPages - 1 ? "opacity-45" : ""
                }`}
                disabled={page >= pageInfo.totalPages - 1}
                onPress={() => setPage((p) => p + 1)}
              >
                <Text className="text-label font-bold text-fg">
                  {t("debtors.nextPage")}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </Animated.ScrollView>
      <View
        className="border-t border-border bg-surface px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <DebtorRegistryExtractCta />
      </View>
    </View>
  );
}
