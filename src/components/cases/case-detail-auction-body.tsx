import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { useAuctionLots } from "@/hooks/use-auction-lots";
import type { CaseDetailAuctionLot } from "@/types/case-detail-data";

import {
  CaseDetailKvCard,
  CaseDetailKvCardList,
} from "./case-detail-kv-card";
import { caseDetailInternalStyles as s } from "./case-detail-internal.styles";
import { caseDetailPanelStyles as p } from "./case-detail-panels.styles";
import { caseDetailTableStyles as tb } from "./case-detail-tables.styles";

function LotCard({ lot }: { lot: CaseDetailAuctionLot }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  return (
    <View style={p.panel}>
      <Pressable style={p.panelHeadRow} onPress={() => setOpen((v) => !v)}>
        <Text style={s.primaryText}>
          {t("cases.detail.auctionLotNPrefix")} {lot.lotNo}
        </Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={22}
          color={DebtorRegistryPalette.buttonBg}
        />
      </Pressable>
      {open ? (
        <View style={tb.padSm}>
          {lot.category ? (
            <Text style={s.mutedText}>
              {lot.category} :: {t("cases.detail.auctionQuantityLabel")}
            </Text>
          ) : null}
          {lot.price ? (
            <Text style={s.mutedText}>
              {t("cases.detail.auctionPriceLabel")}: {lot.price}
            </Text>
          ) : null}
          {lot.winDate ? (
            <Text style={s.mutedText}>
              {t("cases.detail.auctionWinDateLabel")}: {lot.winDate}
            </Text>
          ) : null}

          {lot.stages.length > 0 ? (
            <View>
              <Text style={[s.primaryText, tb.padSm]}>
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
                            <Text style={s.linkText}>
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? "");
  const { data: lots, isLoading } = useAuctionLots(appId);

  if (isLoading) {
    return (
      <View style={tb.padSm}>
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      </View>
    );
  }

  if (!lots || lots.length === 0) {
    return (
      <View style={p.panel}>
        <Text style={[s.mutedText, p.panelBodyPad]}>
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
