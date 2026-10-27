import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { AppHeader, Button, Card, EmptyState } from "@/components/ui";
import { useFactApp } from "@/hooks/use-fact-app";
import { useFactPersons } from "@/hooks/use-fact-persons";
import { useAppTheme } from "@/theme";
import type { FactAppDetail, FactPerson } from "@/types/facts";

import { FactProtocolTab } from "./fact-protocol-tab";
import { FactsDetailTabs, type FactsDetailTab } from "./facts-detail-tabs";

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <View className="gap-0.5">
      <Text className="text-label text-fg-muted">{label}</Text>
      <Text className="text-body font-semibold text-fg">
        {value?.trim() || "—"}
      </Text>
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
    <View
      className={`gap-4 p-4 ${first ? "" : "border-t border-border"}`}
    >
      <Text className="text-body font-bold text-fg">{title}</Text>
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
  factualAddress: "",
  legalAddress: "",
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
      <Card padding="none" className="overflow-hidden">
        <Section title={t("facts.labelApplicant")} first>
          {withPlaceholder(applicants).map((person) => (
            <View
              key={person.id}
              className="gap-4 rounded-md bg-surface-sunken p-4"
            >
              <Field
                label={t("facts.detailLabelApplicantName")}
                value={nameWithId(person.name, person.idnumber)}
              />
              <Field
                label={t("facts.stActualAddressLabel")}
                value={person.factualAddress}
              />
              <Field
                label={t("facts.stLegalAddressLabel")}
                value={person.legalAddress}
              />
              <Field label={t("facts.payCodeLabel")} value={person.payCode} />
            </View>
          ))}
        </Section>
        <Section title={t("facts.detailSectionFactDate")}>
          <View className="gap-4 rounded-md bg-surface-sunken p-4">
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
          <View className="gap-4 rounded-md bg-surface-sunken p-4">
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
            <View
              key={person.id}
              className="gap-4 rounded-md bg-surface-sunken p-4"
            >
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
          <View className="gap-4 rounded-md bg-surface-sunken p-4">
            <Text className="text-body font-semibold text-fg">
              {app.feeName || "—"}
            </Text>
          </View>
        </Section>
        <Section title={t("facts.detailSectionRequest")}>
          <View className="gap-4 rounded-md bg-surface-sunken p-4">
            <Text className="text-body font-semibold text-fg">
              {app.request || "—"}
            </Text>
          </View>
        </Section>
      </Card>
      {/* Recorded (not yet registered) cases only — a registered case has a
          regnumber and can no longer be edited or paid from here. */}
      {!app.regnumber ? (
        // Edit / Pay are visual only until the "ჩაწერა" and payment endpoints
        // exist; Close simply leaves the opened case (spec: რედაქტირება / გადახდა / დახურვა).
        <>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                label={t("facts.detailEditButton")}
                variant="secondary"
                onPress={() => {}}
              />
            </View>
            <View className="flex-1">
              <Button label={t("facts.detailPayButton")} onPress={() => {}} />
            </View>
          </View>
          <Button
            label={t("facts.detailCloseButton")}
            onPress={() => router.back()}
          />
        </>
      ) : null}
    </>
  );
}

export function FactsDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
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
    <View className="flex-1 bg-bg">
      <AppHeader
        title={t("facts.pageTitle")}
        onBack={() => router.back()}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {query.isPending ? (
          <EmptyState icon="file-search-outline" title={t("facts.loadingMessage")} />
        ) : null}
        {!query.isPending && !app ? (
          <EmptyState icon="file-search-outline" title={t("facts.emptyMessage")} />
        ) : null}
        {app ? (
          <View className="gap-4">
            <View className="gap-1">
              <View className="flex-row items-center justify-between gap-2">
                <Text className="text-title font-bold text-fg">
                  # {app.regnumber || app.id}
                </Text>
                {app.date ? (
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color={colors.danger}
                    />
                    <Text className="text-label text-fg">{app.date}</Text>
                  </View>
                ) : null}
              </View>
              {app.bureauName ? (
                <Text className="text-body text-fg-secondary">
                  {app.bureauName}
                </Text>
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
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
