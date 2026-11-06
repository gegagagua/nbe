import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@/theme";
import { useCaseFundsExtra } from "@/hooks/use-case-funds-extra";
import { useMoney } from "@/hooks/use-money";
import type {
  CaseDetailFundsPartyInfo,
  CaseDetailPaymentRow,
  CaseDetailTransferRow,
} from "@/types/case-detail-data";

import {
  CaseDetailKvCard,
  CaseDetailKvCardList,
} from "./case-detail-kv-card";

function FundsPartyCard({
  title,
  info,
}: {
  title: string;
  info: CaseDetailFundsPartyInfo;
}) {
  const { t } = useTranslation();
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Text className="border-b border-border p-2 text-label font-bold text-primary">{title}</Text>
      <View className="p-2">
        {info.partyLines.map((line) => (
          <Text key={line} className="text-caption text-fg-secondary">
            {line}
          </Text>
        ))}

        {info.totalDue ? (
          <Text className="text-caption text-fg-secondary">
            {t("cases.detail.fundsTotalDue")}: {info.totalDue}
          </Text>
        ) : null}
        {info.totalPaid ? (
          <Text className="text-caption text-fg-secondary">
            {t("cases.detail.fundsTotalPaid")}: {info.totalPaid}
          </Text>
        ) : null}
        {info.totalDebt ? (
          <Text className="text-label font-bold text-fg">
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

/**
 * A single credited-payment section for one party (creditor or debtor). The
 * status color drives the participant/amount/remaining/distribution text —
 * green when the payment is finished, red while it is still in progress.
 */
function PaymentsSection({
  title,
  rows,
}: {
  title: string;
  rows: CaseDetailPaymentRow[];
}) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  if (rows.length === 0) return null;
  // Unfinished (in-progress) transactions bubble to the top; stable otherwise.
  const ordered = [...rows].sort(
    (a, b) => Number(a.finished) - Number(b.finished),
  );
  const colored = (value: string, finished: boolean) => (
    <Text
      className="text-right text-label"
      style={{ color: finished ? colors.success : colors.danger }}
    >
      {value || t("cases.detail.emptyTable")}
    </Text>
  );
  return (
    <View className="p-2">
      <Text className="text-label font-bold text-fg">{title}</Text>
      <CaseDetailKvCardList>
        {ordered.map((row) => (
          <CaseDetailKvCard
            key={row.id}
            rows={[
              {
                label: t("cases.detail.fundsPaymentParticipant"),
                value: colored(row.participant, row.finished),
              },
              {
                label: t("cases.detail.fundsPaymentPayer"),
                value: row.payerName || t("cases.detail.emptyTable"),
              },
              {
                label: t("cases.detail.fundsPaymentDistribution"),
                value: colored(
                  row.finished
                    ? t("cases.detail.fundsPaymentFinished")
                    : t("cases.detail.fundsPaymentCurrent"),
                  row.finished,
                ),
              },
              {
                label: t("cases.detail.fundsPaymentAmount"),
                value: colored(row.amount, row.finished),
              },
              {
                label: t("cases.detail.fundsPaymentRemaining"),
                value: colored(row.remaining, row.finished),
              },
              {
                label: t("cases.detail.fundsPaymentDate"),
                value: row.paidAt || t("cases.detail.emptyTable"),
              },
            ]}
          />
        ))}
      </CaseDetailKvCardList>
    </View>
  );
}

function PaymentsCard({
  creditorRows,
  debtorRows,
}: {
  creditorRows: CaseDetailPaymentRow[];
  debtorRows: CaseDetailPaymentRow[];
}) {
  const { t } = useTranslation();
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Text className="border-b border-border p-2 text-label font-bold text-primary">{t("cases.detail.fundsPaymentsTitle")}</Text>
      <PaymentsSection
        title={t("cases.detail.fundsCreditorTitle")}
        rows={creditorRows}
      />
      <PaymentsSection
        title={t("cases.detail.fundsDebtorTitle")}
        rows={debtorRows}
      />
    </View>
  );
}

function TransfersCard({ rows }: { rows: CaseDetailTransferRow[] }) {
  const { t } = useTranslation();
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Text className="border-b border-border p-2 text-label font-bold text-primary">{t("cases.detail.fundsTransfersTitle")}</Text>
      <View className="p-2">
        <CaseDetailKvCardList>
          {rows.map((row) => (
            <CaseDetailKvCard
              key={row.id}
              rows={[
                {
                  label: t("cases.detail.fundsTransferDate"),
                  value: `${t("cases.detail.fundsTransferNo")} ${row.id}`,
                },
                {
                  label: t("cases.detail.fundsTransferStatus"),
                  value: (
                    <Text className="text-right text-label text-fg">
                      <Text
                        style={
                          row.statusColor ? { color: row.statusColor } : undefined
                        }
                      >
                        {row.status || t("cases.detail.emptyTable")}
                      </Text>
                      {row.statusDate ? ` ${row.statusDate}` : ""}
                    </Text>
                  ),
                },
              ]}
            />
          ))}
        </CaseDetailKvCardList>
      </View>
    </View>
  );
}

export function CaseDetailFundsBody() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? "");
  const { data: funds, isLoading } = useMoney(appId);
  const { data: extra, isLoading: extraLoading } = useCaseFundsExtra(appId);

  if (isLoading || extraLoading) {
    return (
      <View className="p-2">
        <ActivityIndicator color={colors.primary} />
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
  const creditorPayments = extra?.creditorPayments ?? [];
  const debtorPayments = extra?.debtorPayments ?? [];
  const hasPayments = creditorPayments.length > 0 || debtorPayments.length > 0;
  const transfers = extra?.transfers ?? [];

  if (
    !hasCreditor &&
    !hasDebtor &&
    !hasPayments &&
    transfers.length === 0
  ) {
    return (
      <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
        <Text className="px-4 py-2 text-caption text-fg-secondary">
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
      {hasPayments ? (
        <PaymentsCard
          creditorRows={creditorPayments}
          debtorRows={debtorPayments}
        />
      ) : null}
      {transfers.length > 0 ? <TransfersCard rows={transfers} /> : null}
    </View>
  );
}
