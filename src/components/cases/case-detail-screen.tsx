import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { getCaseDetailLayoutMock } from "@/constants/case-detail-layout-mock";
import type { CaseDetailMainTab } from "@/types/case-detail-ui";

import { AppHeader } from "@/components/ui/app-header";
import { useAppTheme } from "@/theme";
import { useCaseDetail } from "@/hooks/use-case-detail";

import { CaseDetailApplicationTab } from "./case-detail-application-tab";
import { CaseDetailCloseRow } from "./case-detail-close-row";
import { CaseDetailContactBody } from "./case-detail-contact-body";
import { CaseDetailHeaderSummary } from "./case-detail-header-summary";
import { CaseDetailInfoTab } from "./case-detail-info-tab";
import { CaseDetailMainTabs } from "./case-detail-main-tabs";
import { CaseDetailPaySection } from "./case-detail-pay-section";

export function CaseDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { id, personId, amount, payDisplay } = useLocalSearchParams<{
    id: string;
    personId?: string;
    amount?: string;
    payDisplay?: string;
  }>();
  const caseId = Array.isArray(id) ? id[0] : (id ?? "");
  const [tab, setTab] = useState<CaseDetailMainTab>("application");

  // Real case data drives the header + application tab. The remaining tabs
  // (case info, contact, …) still read from the layout mock until their own
  // endpoints are wired, so the mock is merged in as a fallback.
  const { data: appData, isLoading } = useCaseDetail(caseId);
  const data = useMemo(
    () => ({ ...getCaseDetailLayoutMock(caseId), ...(appData ?? {}) }),
    [caseId, appData],
  );

  if (isLoading && !appData) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <AppHeader title={t("cases.detailTitle")} onBack={() => router.back()} />
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={16}
      >
        <CaseDetailHeaderSummary data={data} />
        <CaseDetailMainTabs value={tab} onChange={setTab} />
        {tab === "application" ? (
          <CaseDetailApplicationTab data={data} />
        ) : null}
        {tab === "caseInfo" ? <CaseDetailInfoTab data={data} /> : null}
        {tab === "contact" ? (
          <CaseDetailContactBody contact={data.contact} />
        ) : null}
        <CaseDetailPaySection
          caseId={caseId}
          personId={personId}
          amount={amount}
          payDisplay={payDisplay}
          data={data}
        />
        <CaseDetailCloseRow onClose={() => router.back()} />
      </KeyboardAwareScrollView>
    </View>
  );
}
