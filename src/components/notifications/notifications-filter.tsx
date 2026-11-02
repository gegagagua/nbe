import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/theme";
import type { NotificationFilterValue } from "@/types/notifications";

const FILTER_OPTIONS: NotificationFilterValue[] = ["all", "read", "unread"];

type Props = {
  value: NotificationFilterValue;
  onChange: (next: NotificationFilterValue) => void;
};

/** Read-state segmented control shown above the notifications feed. */
export function NotificationsFilter({ value, onChange }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <View className="gap-3 rounded-xl border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <Text className="text-subtitle font-semibold text-fg">
          {t("notifications.filterTitle")}
        </Text>
        <MaterialCommunityIcons
          name="tune-variant"
          size={18}
          color={colors.text}
        />
      </View>
      <View
        className="h-11 flex-row items-stretch rounded-lg border border-border bg-surface-sunken p-1"
        accessibilityRole="tablist"
        accessibilityLabel={t("notifications.filterSelectA11yLabel")}
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = option === value;
          return (
            <Pressable
              key={option}
              className={`flex-1 items-center justify-center rounded-md px-1 ${
                isSelected ? "bg-surface" : ""
              }`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(option)}
            >
              <Text
                className={`text-label ${
                  isSelected
                    ? "font-bold text-primary"
                    : "font-medium text-fg-secondary"
                }`}
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
