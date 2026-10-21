import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { debtorExtractRequestStyles as page } from "@/components/debtor-registry/debtor-extract-request.styles";
import { debtorAppDetailActionsStyles as actions } from "@/components/debtor-registry/debtor-app-detail-actions.styles";
import { DebtorExtractSubheader } from "@/components/debtor-registry/debtor-extract-subheader";
import { LoginFooter } from "@/components/login/login-footer";
import { AppSafeArea } from "@/components/ui/app-safe-area";
import { LoginPalette } from "@/constants/login";
import { useFactApp } from "@/hooks/use-fact-app";
import { useFactPersons } from "@/hooks/use-fact-persons";
import type { FactAppDetail, FactPerson } from "@/types/facts";

import { factsDetailStyles as s } from "./facts-detail.styles";
import { FactProtocolTab } from "./fact-protocol-tab";
import { FactsDetailTabs, type FactsDetailTab } from "./facts-detail-tabs";

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={s.fieldValue}>{value?.trim() || "—"}</Text>
    </View>
  );
}

function Section({
  title,
  first,
  children,
}: {
  title: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={[s.section, !first && s.sectionDivider]}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

/** "ირმა სიხარულიძე (12345678979)" */
function nameWithId(name: string, idnumber: string) {
  return [name, idnumber ? `(${idnumber})` : ""].filter(Boolean).join(" ");
}

const EMPTY_PERSON: FactPerson = {
  id: -1,
  name: "",
  idnumber: "",
  address: "",
  payCode: "",
};

/** Keeps the section's frame visible (with "—" values) when nobody is listed. */
const withPlaceholder = (persons: FactPerson[]) =>
  persons.length > 0 ? persons : [EMPTY_PERSON];

function ApplicationTab({
  app,
  applicants,
  owners,
}: {
  app: FactAppDetail;
  applicants: FactPerson[];
  owners: FactPerson[];
}) {
  const { t } = useTranslation();

  return (
    <>
      <View style={s.detailsCard}>
        <Section title={t("facts.labelApplicant")} first>
          {withPlaceholder(applicants).map((person) => (
            <View key={person.id} style={s.shaded}>
              <Field
                label={t("facts.detailLabelApplicantName")}
                value={nameWithId(person.name, person.idnumber)}
              />
              <Field
                label={t("facts.detailLabelAddress")}
                value={person.address}
              />
              <Field label={t("facts.payCodeLabel")} value={person.payCode} />
            </View>
          ))}
        </Section>
        <Section title={t("facts.detailSectionFactDate")}>
          <View style={s.shaded}>
            <Field
              label={t("facts.detailLabelFactTimeFrom")}
              value={app.factTimeFrom}
            />
            <Field
              label={t("facts.detailLabelFactTimeTo")}
              value={app.factTimeTo}
            />
          </View>
        </Section>
        <Section title={t("facts.detailSectionFactPlace")}>
          <View style={s.shaded}>
            <Field
              label={t("facts.labelOwnershipType")}
              value={app.propertyType}
            />
            <Field label={t("facts.detailLabelCadCode")} value={app.cadCode} />
            <Field
              label={t("facts.detailLabelAddress")}
              value={app.propertyAddress}
            />
          </View>
        </Section>
        <Section title={t("facts.detailSectionOwner")}>
          {withPlaceholder(owners).map((person) => (
            <View key={person.id} style={s.shaded}>
              <Field
                label={t("facts.detailLabelOwnerName")}
                value={person.name}
              />
              <Field
                label={t("facts.detailLabelOwnerId")}
                value={person.idnumber}
              />
              <Field
                label={t("facts.detailLabelAddress")}
                value={person.address}
              />
            </View>
          ))}
        </Section>
        <Section title={t("facts.labelFee")}>
          <View style={s.shaded}>
            <Text style={s.fieldValue}>{app.feeName || "—"}</Text>
          </View>
        </Section>
        <Section title={t("facts.detailSectionRequest")}>
          <View style={s.shaded}>
            <Text style={s.fieldValue}>{app.request || "—"}</Text>
          </View>
        </Section>
      </View>
      {/* Recorded (not yet registered) cases only — a registered case has a
          regnumber and can no longer be edited or paid from here. */}
      {!app.regnumber ? (
        // Edit / Pay are visual only until the "ჩაწერა" and payment endpoints
        // exist; Close simply leaves the opened case (spec: რედაქტირება / გადახდა / დახურვა).
        <>
          <View style={actions.row}>
            <Pressable
              style={[actions.btn, actions.editBtn]}
              accessibilityRole="button"
            >
              <Text style={actions.editLabel}>
                {t("facts.detailEditButton")}
              </Text>
            </Pressable>
            <Pressable
              style={[actions.btn, actions.payBtn]}
              accessibilityRole="button"
            >
              <Text style={actions.payLabel}>{t("facts.detailPayButton")}</Text>
            </Pressable>
          </View>
          <Pressable
            style={actions.fullBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
          >
            <Text style={actions.payLabel}>{t("facts.detailCloseButton")}</Text>
          </Pressable>
        </>
      ) : null}
    </>
  );
}

export function FactsDetailScreen() {
  const { t } = useTranslation();
  const { id, personId } = useLocalSearchParams<{
    id: string;
    personId?: string;
  }>();
  const appId = Number(id);
  const query = useFactApp(Number.isFinite(appId) ? appId : null);
  const { applicants: allApplicants, owners } = useFactPersons(
    Number.isFinite(appId) ? appId : null,
  );
  // Show only the applicant from the tapped list card; fall back to everyone
  // when the card carried no person id or it doesn't match (e.g. deep link).
  const cardApplicant = allApplicants.filter(
    (person) => String(person.id) === personId,
  );
  const applicants = cardApplicant.length > 0 ? cardApplicant : allApplicants;
  const app = query.data;
  const [tab, setTab] = useState<FactsDetailTab>("application");

  return (
    <View style={page.page}>
      <AppSafeArea style={page.body}>
        <DebtorExtractSubheader
          title={t("facts.pageTitle")}
          backA11y={t("facts.backA11yLabel")}
          onBack={() => router.back()}
        />
        <ScrollView style={page.scroll} contentContainerStyle={page.content}>
          {query.isPending ? (
            <Text style={page.hintText}>{t("facts.loadingMessage")}</Text>
          ) : null}
          {!query.isPending && !app ? (
            <Text style={page.hintText}>{t("facts.emptyMessage")}</Text>
          ) : null}
          {app ? (
            <>
              <View style={s.summary}>
                <View style={s.summaryRow}>
                  <Text style={s.caseNumber}># {app.regnumber || app.id}</Text>
                  {app.date ? (
                    <View style={s.dateRow}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={14}
                        color={LoginPalette.logoRed}
                      />
                      <Text style={s.dateText}>{app.date}</Text>
                    </View>
                  ) : null}
                </View>
                {app.bureauName ? (
                  <Text style={s.bureau}>{app.bureauName}</Text>
                ) : null}
              </View>
              <FactsDetailTabs value={tab} onChange={setTab} />
              {tab === "application" ? (
                <ApplicationTab
                  app={app}
                  applicants={applicants}
                  owners={owners}
                />
              ) : (
                <FactProtocolTab appId={appId} />
              )}
            </>
          ) : null}
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
