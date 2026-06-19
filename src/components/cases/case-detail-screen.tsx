import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { getCaseDetailLayoutMock } from "@/constants/case-detail-layout-mock";
import { LoginPalette } from "@/constants/login";
import type { CaseDetailMainTab } from "@/types/case-detail-ui";

import { AppSafeArea } from "@/components/ui/app-safe-area";
import { useCaseDetail } from "@/hooks/use-case-detail";

import { CaseDetailApplicationTab } from "./case-detail-application-tab";
import { CaseDetailCloseRow } from "./case-detail-close-row";
import { CaseDetailContactBody } from "./case-detail-contact-body";
import { CaseDetailHeaderSummary } from "./case-detail-header-summary";
import { CaseDetailInfoTab } from "./case-detail-info-tab";
import { CaseDetailMainTabs } from "./case-detail-main-tabs";
import { CaseDetailPaySection } from "./case-detail-pay-section";
import { caseDetailScreenStyles as layout } from "./case-detail-screen.styles";

export function CaseDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
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
      <AppSafeArea style={layout.page}>
        <View style={[layout.scroll, { flex: 1, justifyContent: "center" }]}>
          <ActivityIndicator size="large" color={LoginPalette.primary} />
        </View>
      </AppSafeArea>
    );
  }

  return (
    <AppSafeArea style={layout.page}>
      <KeyboardAwareScrollView
        contentContainerStyle={layout.scroll}
        keyboardShouldPersistTaps="handled"
        bottomOffset={16}
      >
        <View style={layout.headerRow}>
          <Pressable
            style={layout.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t("cases.detailBack")}
          >
            <Text style={layout.backText}>{t("cases.detailBack")}</Text>
          </Pressable>
          <Text style={layout.title} numberOfLines={1}>
            {t("cases.detailTitle")}
          </Text>
        </View>
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
    </AppSafeArea>
  );
}
