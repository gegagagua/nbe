import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { useAppTheme } from "@/theme";
import type { AppNotification } from "@/types/notifications";

type Props = {
  item: AppNotification;
  selected: boolean;
  onToggleSelected: (id: number) => void;
  onPress: (item: AppNotification) => void;
};

/**
 * One row of the notifications feed. Shows the module, the notification type,
 * its case number and a body preview, plus the received date-time. Unread rows
 * are bolder and outlined; the leading checkbox ticks the row for bulk actions,
 * while pressing the body opens the detail.
 */
export function NotificationListItem({
  item,
  selected,
  onToggleSelected,
  onPress,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const unread = !item.isRead;
  const moduleLabel = item.module;

  return (
    <View
      className={`flex-row items-start gap-2 rounded-xl border bg-surface p-3 ${
        unread ? "border-accent" : "border-border"
      } ${selected ? "bg-primary-subtle" : ""}`}
    >
      <Pressable
        className="pt-px"
        onPress={() => onToggleSelected(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={t("notifications.selectRowA11yLabel")}
        hitSlop={8}
      >
        <MaterialCommunityIcons
          name={selected ? "checkbox-marked" : "checkbox-blank-outline"}
          size={22}
          color={selected ? colors.accent : colors.textSecondary}
        />
      </Pressable>
      <PressableScale
        className="flex-1 gap-1"
        pressedScale={0.99}
        haptic="none"
        accessibilityRole="button"
        accessibilityLabel={`${moduleLabel} ${item.title} #${item.caseNumber} ${item.receivedAt}`.trim()}
        accessibilityHint={
          unread ? t("notifications.markRowReadA11yHint") : undefined
        }
        onPress={() => onPress(item)}
      >
        <View className="flex-row items-center justify-between gap-2">
          <Text className="flex-1 text-caption text-fg-muted" numberOfLines={1}>
            {moduleLabel}
          </Text>
          <Text className="text-caption text-fg-muted">{item.receivedAt}</Text>
        </View>
        <Text
          className={`text-body text-fg ${unread ? "font-bold" : "font-normal"}`}
        >
          {item.title}
        </Text>
        <Text
          className={`text-body text-fg ${unread ? "font-bold" : "font-normal"}`}
        >
          {`#${item.caseNumber}`}
        </Text>
      </PressableScale>
    </View>
  );
}
