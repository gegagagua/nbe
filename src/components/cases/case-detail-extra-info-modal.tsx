import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Layout } from "@/constants/layout";
import { Space } from "@/constants/theme";
import { useAppTheme } from "@/theme";
import { useCaseExtraInfo } from "@/hooks/use-case-extra-info";
import type { CaseDetailExtraInfoRow } from "@/types/case-detail-data";

import { CaseDetailKvCard } from "./case-detail-kv-card";

type Props = {
  visible: boolean;
  onClose: () => void;
};

type ViewProps = Props & {
  rows: CaseDetailExtraInfoRow[] | undefined;
  isLoading: boolean;
};

/**
 * Presentational "დამატებითი ინფორმაცია" modal. Given already-resolved detail
 * rows, it renders the loading / empty / list states. Shared by the logged-in
 * case screen (self-fetch wrapper below) and the guest fine check screen, which
 * already holds the rows in hand.
 */
export function CaseDetailExtraInfoModalView({
  visible,
  onClose,
  rows,
  isLoading,
}: ViewProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40">
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t("cases.detail.extraInfoCloseA11y")}
        />
        <View className="flex-1 justify-center px-4" pointerEvents="box-none">
          <View className="overflow-hidden rounded-md border border-border bg-surface">
            <View className="flex-row items-center justify-between border-b border-border p-2">
              <Text className="flex-1 font-bold text-primary">{t("cases.detail.extraInfoTitle")}</Text>
              <Pressable
                onPress={onClose}
                hitSlop={Space.small}
                accessibilityRole="button"
                accessibilityLabel={t("cases.detail.extraInfoCloseA11y")}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={Layout.registerBackIconSize}
                  color={colors.primary}
                />
              </Pressable>
            </View>
            {isLoading ? (
              <View className="p-2">
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : !rows || rows.length === 0 ? (
              <Text className="p-2 text-caption text-fg-secondary">
                {t("cases.detail.extraInfoEmpty")}
              </Text>
            ) : (
              <ScrollView
                className="max-h-[420px]"
                contentContainerClassName="p-2"
                showsVerticalScrollIndicator
              >
                <CaseDetailKvCard
                  rows={rows.map((row) => ({
                    label: row.label || t("cases.detail.emptyTable"),
                    value: row.value,
                  }))}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * "დამატებითი ინფორმაცია" modal — agency-provided fine details for an 08/1 case.
 * Self-fetches off the `id` route param; only queries while open. The details
 * are optional, so an empty payload renders the empty-state message.
 */
export function CaseDetailExtraInfoModal({ visible, onClose }: Props) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? "");
  const { data: rows, isLoading } = useCaseExtraInfo(appId, {
    enabled: visible,
  });

  return (
    <CaseDetailExtraInfoModalView
      visible={visible}
      onClose={onClose}
      rows={rows}
      isLoading={isLoading}
    />
  );
}
