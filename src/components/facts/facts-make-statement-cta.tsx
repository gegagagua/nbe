import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { debtorRegistryExtractCtaStyles as s } from "@/components/debtor-registry/debtor-registry-extract-cta.styles";

/** „განცხადების გაკეთება" — opens the fact-statement request flow. */
export function FactsMakeStatementCta() {
  const { t } = useTranslation();
  return (
    <View style={s.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("facts.makeStatementButton")}
        style={({ pressed }) => [s.press, pressed && s.pressPressed]}
        onPress={() => router.push("/facts/statement")}
      >
        <Text style={s.label}>{t("facts.makeStatementButton")}</Text>
      </Pressable>
    </View>
  );
}
