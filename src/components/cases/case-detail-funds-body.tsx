import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { useMoney } from "@/hooks/use-money";
import type { CaseDetailFundsPartyInfo } from "@/types/case-detail-data";

import {
  CaseDetailKvCard,
  CaseDetailKvCardList,
} from "./case-detail-kv-card";
import { caseDetailInternalStyles as s } from "./case-detail-internal.styles";
import { caseDetailPanelStyles as p } from "./case-detail-panels.styles";
import { caseDetailTableStyles as tb } from "./case-detail-tables.styles";

function FundsPartyCard({
  title,
  info,
}: {
  title: string;
  info: CaseDetailFundsPartyInfo;
}) {
  const { t } = useTranslation();
  return (
    <View style={p.panel}>
      <Text style={p.panelTitle}>{title}</Text>
      <View style={tb.padSm}>
        {info.partyLines.map((line) => (
          <Text key={line} style={s.mutedText}>
            {line}
          </Text>
        ))}

        {info.totalDue ? (
          <Text style={s.mutedText}>
            {t("cases.detail.fundsTotalDue")}: {info.totalDue}
          </Text>
        ) : null}
        {info.totalPaid ? (
          <Text style={s.mutedText}>
            {t("cases.detail.fundsTotalPaid")}: {info.totalPaid}
          </Text>
        ) : null}
        {info.totalDebt ? (
          <Text style={s.primaryText}>
            {t("cases.detail.fundsTotalDebt")}: {info.totalDebt}
          </Text>
        ) : null}

        {info.rows.length > 0 ? (
          <CaseDetailKvCardList>
            {info.rows.map((row, i) => (
              <CaseDetailKvCard
                key={`${row.name}-${i}`}
                rows={[
                  {
                    label: t("cases.detail.fundsColName"),
                    value: row.name || t("cases.detail.emptyTable"),
                  },
                  { label: t("cases.detail.fundsColDue"), value: row.due },
                  { label: t("cases.detail.fundsColPaid"), value: row.paid },
                  { label: t("cases.detail.fundsColDebt"), value: row.debt },
                ]}
              />
            ))}
          </CaseDetailKvCardList>
        ) : null}
      </View>
    </View>
  );
}

export function CaseDetailFundsBody() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? "");
  const { data: funds, isLoading } = useMoney(appId);

  if (isLoading) {
    return (
      <View style={tb.padSm}>
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      </View>
    );
  }

  const creditor = funds?.creditor;
  const debtor = funds?.debtor;
  const hasCreditor = Boolean(
    creditor && (creditor.rows.length > 0 || creditor.partyLines.length > 0),
  );
  const hasDebtor = Boolean(
    debtor && (debtor.rows.length > 0 || debtor.partyLines.length > 0),
  );

  if (!hasCreditor && !hasDebtor) {
    return (
      <View style={p.panel}>
        <Text style={[s.mutedText, p.panelBodyPad]}>
          {t("cases.detail.fundsEmpty")}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {hasCreditor ? (
        <FundsPartyCard
          title={t("cases.detail.fundsCreditorTitle")}
          info={creditor!}
        />
      ) : null}
      {hasDebtor ? (
        <FundsPartyCard
          title={t("cases.detail.fundsDebtorTitle")}
          info={debtor!}
        />
      ) : null}
    </View>
  );
}
