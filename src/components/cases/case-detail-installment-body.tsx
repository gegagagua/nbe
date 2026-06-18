import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { useInstallments } from "@/hooks/use-installments";
import type { CaseDetailInstallment } from "@/types/case-detail-data";

import { caseDetailInternalStyles as s } from "./case-detail-internal.styles";
import { caseDetailPanelStyles as p } from "./case-detail-panels.styles";
import { caseDetailTableStyles as tb } from "./case-detail-tables.styles";

function InstallmentCard({ item }: { item: CaseDetailInstallment }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  return (
    <View style={p.panel}>
      <Pressable style={p.panelHeadRow} onPress={() => setOpen((v) => !v)}>
        <Text style={s.linkText}>{item.headerLine}</Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={22}
          color={DebtorRegistryPalette.buttonBg}
        />
      </Pressable>
      {open ? (
        <View style={tb.padSm}>
          <View style={s.fileRow}>
            <Text style={s.mutedText}>{item.partyLine}</Text>
            {item.status ? (
              <Text style={s.mutedText}>
                {t("cases.detail.installmentStatusLabel")}: {item.status}
              </Text>
            ) : null}
          </View>

          {item.payments.length > 0 ? (
            <View style={[tb.borderBox, s.claimsTableWrap]}>
              <View style={tb.tableHead}>
                <Text style={tb.tableHeadCell}>
                  {t("cases.detail.instColPaymentDate")}
                </Text>
                <Text style={tb.tableHeadCell}>
                  {t("cases.detail.instColToPay")}
                </Text>
                <Text style={tb.tableHeadCell}>
                  {t("cases.detail.instColPaid")}
                </Text>
                <Text style={tb.tableHeadCell}>
                  {t("cases.detail.instColRemained")}
                </Text>
                <Text style={tb.tableHeadCell}>
                  {t("cases.detail.instColConfirm")}
                </Text>
                <Text style={tb.tableHeadCell}>
                  {t("cases.detail.instColConfirmedBy")}
                </Text>
              </View>
              {item.payments.map((pay, i) => (
                <View key={`${pay.paymentDate}-${i}`} style={tb.tableRow}>
                  <Text style={tb.tableCell}>{pay.paymentDate}</Text>
                  <Text style={tb.tableCell}>{pay.amountToPay}</Text>
                  <Text style={tb.tableCell}>{pay.amountPayed}</Text>
                  <Text style={tb.tableCell}>{pay.remainedAmount}</Text>
                  <Text style={tb.tableCell}>{pay.status}</Text>
                  <View style={tb.tableCell}>
                    <Text style={s.primaryText}>{pay.confirmedBy}</Text>
                    {pay.confirmDate ? (
                      <Text style={s.mutedText}>{pay.confirmDate}</Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function CaseDetailInstallmentBody() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? "");
  const { data: installments, isLoading } = useInstallments(appId);

  if (isLoading) {
    return (
      <View style={tb.padSm}>
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      </View>
    );
  }

  if (!installments || installments.length === 0) {
    return (
      <View style={p.panel}>
        <Text style={[s.mutedText, p.panelBodyPad]}>
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
