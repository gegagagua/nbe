import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@/theme";
import { useAuctionLots } from "@/hooks/use-auction-lots";
import type { CaseDetailAuctionLot } from "@/types/case-detail-data";

import {
  CaseDetailKvCard,
  CaseDetailKvCardList,
} from "./case-detail-kv-card";

function LotCard({ lot }: { lot: CaseDetailAuctionLot }) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(true);
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Pressable className="flex-row items-center justify-between border-b border-border p-2" onPress={() => setOpen((v) => !v)}>
        <Text className="text-label font-bold text-fg">
          {t("cases.detail.auctionLotNPrefix")} {lot.lotNo}
        </Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={22}
          color={colors.primary}
        />
      </Pressable>
      {open ? (
        <View className="p-2">
          {lot.category ? (
            <Text className="text-caption text-fg-secondary">
              {lot.category} :: {t("cases.detail.auctionQuantityLabel")}
            </Text>
          ) : null}
          {lot.price ? (
            <Text className="text-caption text-fg-secondary">
              {t("cases.detail.auctionPriceLabel")}: {lot.price}
            </Text>
          ) : null}
          {lot.winDate ? (
            <Text className="text-caption text-fg-secondary">
              {t("cases.detail.auctionWinDateLabel")}: {lot.winDate}
            </Text>
          ) : null}

          {lot.stages.length > 0 ? (
            <View>
              <Text className="p-2 text-label font-bold text-fg">
                {t("cases.detail.auctionStagesTitle")}
              </Text>
              <CaseDetailKvCardList>
                {lot.stages.map((stage, i) => (
                  <CaseDetailKvCard
                    key={`${stage.type}-${i}`}
                    rows={[
                      { label: t("cases.detail.auctionColType"), value: stage.type },
                      {
                        label: t("cases.detail.auctionColStart"),
                        value: stage.startDate,
                      },
                      {
                        label: t("cases.detail.auctionColEnd"),
                        value: stage.endDate,
                      },
                      {
                        label: t("cases.detail.auctionOpenEauction"),
                        value: stage.eaucUrl ? (
                          <Pressable
                            onPress={() => Linking.openURL(stage.eaucUrl)}
                            accessibilityRole="link"
                            accessibilityLabel={t(
                              "cases.detail.auctionOpenEauction",
                            )}
                          >
                            <Text className="text-label text-primary underline">
                              {t("cases.detail.auctionOpenEauction")}
                            </Text>
                          </Pressable>
                        ) : (
                          t("cases.detail.emptyTable")
                        ),
                      },
                    ]}
                  />
                ))}
              </CaseDetailKvCardList>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function CaseDetailAuctionBody() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? "");
  const { data: lots, isLoading } = useAuctionLots(appId);

  if (isLoading) {
    return (
      <View className="p-2">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!lots || lots.length === 0) {
    return (
      <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
        <Text className="px-4 py-2 text-caption text-fg-secondary">
          {t("cases.detail.auctionEmpty")}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {lots.map((lot) => (
        <LotCard key={lot.lotNo} lot={lot} />
      ))}
    </View>
  );
}
