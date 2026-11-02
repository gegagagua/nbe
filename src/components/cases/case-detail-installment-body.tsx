import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@/theme";
import { useInstallments } from "@/hooks/use-installments";
import type { CaseDetailInstallment } from "@/types/case-detail-data";

import {
  CaseDetailKvCard,
  CaseDetailKvCardList,
} from "./case-detail-kv-card";

function InstallmentCard({ item }: { item: CaseDetailInstallment }) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(true);
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Pressable className="flex-row items-center justify-between border-b border-border p-2" onPress={() => setOpen((v) => !v)}>
        <Text className="text-label text-primary underline">{item.headerLine}</Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={22}
          color={colors.primary}
        />
      </Pressable>
      {open ? (
        <View className="p-2">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-caption text-fg-secondary">{item.partyLine}</Text>
            {item.status ? (
              <Text className="text-caption text-fg-secondary">
                {t("cases.detail.installmentStatusLabel")}: {item.status}
              </Text>
            ) : null}
          </View>

          {item.payments.length > 0 ? (
            <CaseDetailKvCardList>
              {item.payments.map((pay, i) => (
                <CaseDetailKvCard
                  key={`${pay.paymentDate}-${i}`}
                  rows={[
                    {
                      label: t("cases.detail.instColPaymentDate"),
                      value: pay.paymentDate,
                    },
                    {
                      label: t("cases.detail.instColToPay"),
                      value: pay.amountToPay,
                    },
                    {
                      label: t("cases.detail.instColPaid"),
                      value: pay.amountPayed,
                    },
                    {
                      label: t("cases.detail.instColRemained"),
                      value: pay.remainedAmount,
                    },
                    {
                      label: t("cases.detail.instColConfirm"),
                      value: pay.status,
                    },
                    {
                      label: t("cases.detail.instColConfirmedBy"),
                      value: (
                        <>
                          <Text className="text-label font-bold text-fg">{pay.confirmedBy}</Text>
                          {pay.confirmDate ? (
                            <Text className="text-caption text-fg-secondary">{pay.confirmDate}</Text>
                          ) : null}
                        </>
                      ),
                    },
                  ]}
                />
              ))}
            </CaseDetailKvCardList>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function CaseDetailInstallmentBody() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? "");
  const { data: installments, isLoading } = useInstallments(appId);

  if (isLoading) {
    return (
      <View className="p-2">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!installments || installments.length === 0) {
    return (
      <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
        <Text className="px-4 py-2 text-caption text-fg-secondary">
          {t("cases.detail.installmentEmpty")}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {installments.map((item) => (
        <InstallmentCard key={item.installmentId} item={item} />
      ))}
    </View>
  );
}
