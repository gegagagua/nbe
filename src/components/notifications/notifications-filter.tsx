import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import {
  NotificationsLayout,
  NotificationsPalette,
} from "@/constants/notifications";
import type { NotificationFilterValue } from "@/types/notifications";

import { notificationsFilterStyles as s } from "./notifications-filter.styles";

const FILTER_OPTIONS: NotificationFilterValue[] = ["all", "read", "unread"];

type Props = {
  value: NotificationFilterValue;
  onChange: (next: NotificationFilterValue) => void;
};

/** Read-state segmented control shown above the notifications feed. */
export function NotificationsFilter({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View style={s.panel}>
      <View style={s.titleRow}>
        <Text style={s.title}>{t("notifications.filterTitle")}</Text>
        <MaterialCommunityIcons
          name="tune-variant"
          size={NotificationsLayout.filterIconSize}
          color={NotificationsPalette.textPrimary}
        />
      </View>
      <View
        style={s.track}
        accessibilityRole="tablist"
        accessibilityLabel={t("notifications.filterSelectA11yLabel")}
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = option === value;
          return (
            <Pressable
              key={option}
              style={[s.segment, isSelected ? s.segmentActive : null]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(option)}
            >
              <Text
                style={[
                  s.segmentLabel,
                  isSelected ? s.segmentLabelActive : null,
                ]}
                numberOfLines={1}
              >
                {t(`notifications.filterOptions.${option}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
