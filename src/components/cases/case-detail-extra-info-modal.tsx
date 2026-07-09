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

import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { Layout } from "@/constants/layout";
import { LoginPalette } from "@/constants/login";
import { Space } from "@/constants/theme";
import { useCaseExtraInfo } from "@/hooks/use-case-extra-info";

import { CaseDetailKvCard } from "./case-detail-kv-card";
import { caseDetailInternalStyles as s } from "./case-detail-internal.styles";
import { caseDetailModalStyles as m } from "./case-detail-modal.styles";
import { caseDetailPanelStyles as p } from "./case-detail-panels.styles";
import { caseDetailTableStyles as tb } from "./case-detail-tables.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

/**
 * "დამატებითი ინფორმაცია" modal — agency-provided fine details for an 08/1 case.
 * Self-fetches off the `id` route param; only queries while open. The details
 * are optional, so an empty payload renders the empty-state message.
 */
export function CaseDetailExtraInfoModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? "");
  const { data: rows, isLoading } = useCaseExtraInfo(appId, {
    enabled: visible,
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={m.scrimFill}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t("cases.detail.extraInfoCloseA11y")}
        />
        <View style={x.centerWrap} pointerEvents="box-none">
          <View style={[p.panel, x.card]}>
            <View style={p.panelHeadRow}>
              <Text style={x.title}>{t("cases.detail.extraInfoTitle")}</Text>
              <Pressable
                onPress={onClose}
                hitSlop={Space.small}
                accessibilityRole="button"
                accessibilityLabel={t("cases.detail.extraInfoCloseA11y")}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={Layout.registerBackIconSize}
                  color={LoginPalette.primary}
                />
              </Pressable>
            </View>
            {isLoading ? (
              <View style={tb.padSm}>
                <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
              </View>
            ) : !rows || rows.length === 0 ? (
              <Text style={[s.mutedText, tb.padSm]}>
                {t("cases.detail.extraInfoEmpty")}
              </Text>
            ) : (
              <ScrollView
                style={x.scroll}
                contentContainerStyle={tb.padSm}
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

const x = StyleSheet.create({
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Space.medium,
  },
  card: {
    marginBottom: 0,
    backgroundColor: DebtorRegistryPalette.cardBg,
  },
  title: {
    flex: 1,
    fontWeight: "700",
    color: DebtorRegistryPalette.buttonBg,
  },
  scroll: {
    maxHeight: 420,
  },
});
