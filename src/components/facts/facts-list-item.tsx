import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { LoginPalette } from "@/constants/login";
import type { FactApplication } from "@/types/facts";

import { factsListItemStyles as s } from "./facts-list-item.styles";

export function FactsListItem({
  item,
  index = 0,
}: {
  item: FactApplication;
  index?: number;
}) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInDown.duration(280)
        .delay(Math.min(index, 8) * 40)
        .springify()
        .damping(18)}
    >
      <View style={s.card}>
        <View style={s.topRow}>
          <View style={s.leftCol}>
            {item.referenceNumber ? (
              <Text style={s.reference}># {item.referenceNumber}</Text>
            ) : null}
            <Text style={s.bureau}>{item.bureauName}</Text>
            <Text style={s.caseLine}>
              # {item.caseNumber}
              {item.registeredAt ? ` - ${item.registeredAt}` : ""}
            </Text>
          </View>
          <View style={s.rightCol}>
            <Text style={s.fieldLabel}>{t("facts.labelExecutor")}:</Text>
            {item.executor ? (
              <Text style={s.partyValue}>{item.executor}</Text>
            ) : (
              <Text style={s.partyValue}>—</Text>
            )}
            <Text style={s.partyLabel}>{t("facts.labelApplicant")}</Text>
            <Text style={s.partyValue}>
              {item.applicant.name} ({item.applicant.idnumber})
            </Text>
          </View>
        </View>
        {item.status ? (
          <View style={s.statusRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={LoginPalette.logoRed}
            />
            <Text style={s.statusLabel}>{item.status.label}</Text>
            <Text style={s.statusMuted}>- {item.status.date}</Text>
            <Text style={s.statusMuted}>
              {t("facts.labelFee")}:{" "}
              <Text style={s.statusStrong}>{item.status.fee}</Text>
            </Text>
            <Text style={s.statusMuted}>
              {t("facts.labelOwnershipType")}:{" "}
              <Text style={s.statusStrong}>{item.status.ownershipType}</Text>
            </Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}
