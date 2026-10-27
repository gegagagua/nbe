import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";

/** „განცხადების გაკეთება" — opens the fact-statement request flow. */
export function FactsMakeStatementCta() {
  const { t } = useTranslation();
  return (
    <Button
      label={t("facts.makeStatementButton")}
      onPress={() => router.push("/facts/statement")}
    />
  );
}
