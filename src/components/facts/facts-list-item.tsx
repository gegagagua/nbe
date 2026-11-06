import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card } from "@/components/ui";
import { useAppTheme } from "@/theme";
import type { FactApplication } from "@/types/facts";

export function FactsListItem({
  item,
  index = 0,
}: {
  item: FactApplication;
  index?: number;
}) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(280)
        .delay(Math.min(index, 8) * 40)
        .springify()
        .damping(18)}
    >
      <Card
        padding="sm"
        className="border-l-4 border-l-danger p-3"
        onPress={() =>
          router.push({
            pathname: "/facts/[id]",
            params: {
              id: String(item.id),
              personId:
                item.applicant.id != null ? String(item.applicant.id) : "",
            },
          })
        }
        accessibilityLabel={item.referenceNumber ?? item.caseNumber}
      >
        <View className="flex-row gap-3">
          <View className="min-w-0 flex-1">
            {item.referenceNumber ? (
              <Text className="mb-0.5 text-body-lg font-bold text-danger">
                # {item.referenceNumber}
              </Text>
            ) : null}
            <Text className="text-body-lg font-bold text-fg">{item.bureauName}</Text>
            <Text className="mt-0.5 text-label text-fg-muted">
              # {item.caseNumber}
              {item.registeredAt ? ` - ${item.registeredAt}` : ""}
            </Text>
          </View>
          <View className="max-w-[48%] shrink-0">
            <View className="flex-row items-center justify-between gap-1">
              <Text className="text-label text-fg-muted">
                {t("facts.labelExecutor")}:
              </Text>
              {item.incomeSource === "EXTERNAL" ? (
                <View
                  className="h-7 w-7 items-center justify-center rounded-full bg-primary-subtle"
                  accessible
                  accessibilityLabel={t("facts.externalSourceA11yLabel")}
                >
                  <MaterialCommunityIcons
                    name="cellphone"
                    size={16}
                    color={colors.primary}
                  />
                </View>
              ) : null}
            </View>
            <Text className="mt-0.5 text-label font-semibold text-fg">
              {item.executor ? item.executor : "—"}
            </Text>
            <Text className="mt-1 text-label font-bold text-primary">
              {t("facts.labelApplicant")}
            </Text>
            <Text className="mt-0.5 text-label font-semibold text-fg">
              {item.applicant.name} ({item.applicant.idnumber})
            </Text>
          </View>
        </View>
        {item.status ? (
          <View className="mt-2 flex-row flex-wrap items-center gap-1 border-t border-border pt-2">
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={colors.danger}
            />
            <Text className="text-label font-bold text-danger">
              {item.status.label}
            </Text>
            <Text className="text-label text-fg-muted">- {item.status.date}</Text>
            <Text className="text-label text-fg-muted">
              {t("facts.labelFee")}:{" "}
              <Text className="font-bold text-fg">{item.status.fee}</Text>
            </Text>
            <Text className="text-label text-fg-muted">
              {t("facts.labelOwnershipType")}:{" "}
              <Text className="font-bold text-fg">
                {item.status.ownershipType}
              </Text>
            </Text>
          </View>
        ) : null}
      </Card>
    </Animated.View>
  );
}
