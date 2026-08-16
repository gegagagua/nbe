import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { DebtorRegistryPalette } from "@/constants/debtor-registry";
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

/** In-progress transactions are red, completed ones green. */
const PAYMENT_STATUS_COLORS = {
  current: "#CC0000",
  finished: "#339900",
} as const;

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
  if (rows.length === 0) return null;
  // Unfinished (in-progress) transactions bubble to the top; stable otherwise.
  const ordered = [...rows].sort(
    (a, b) => Number(a.finished) - Number(b.finished),
  );
  const colored = (value: string, finished: boolean) => (
    <Text
      style={[
        tb.kvValueText,
        {
          color: finished
            ? PAYMENT_STATUS_COLORS.finished
            : PAYMENT_STATUS_COLORS.current,
        },
      ]}
    >
      {value || t("cases.detail.emptyTable")}
    </Text>
  );
  return (
    <View style={tb.padSm}>
      <Text style={s.primaryText}>{title}</Text>
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
    <View style={p.panel}>
      <Text style={p.panelTitle}>{t("cases.detail.fundsPaymentsTitle")}</Text>
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
    <View style={p.panel}>
      <Text style={p.panelTitle}>{t("cases.detail.fundsTransfersTitle")}</Text>
      <View style={tb.padSm}>
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
                    <Text style={tb.kvValueText}>
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? "");
  const { data: funds, isLoading } = useMoney(appId);
  const { data: extra, isLoading: extraLoading } = useCaseFundsExtra(appId);

  if (isLoading || extraLoading) {
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
