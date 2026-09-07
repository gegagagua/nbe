import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { LoginInteraction } from "@/constants/login";
import {
  NotificationsLayout,
  NotificationsPalette,
} from "@/constants/notifications";
import type { AppNotification } from "@/types/notifications";

import { notificationListItemStyles as s } from "./notification-list-item.styles";

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
  const unread = !item.isRead;
  const moduleLabel =
    item.module === "other" ? "" : t(`notifications.modules.${item.module}`);

  return (
    <View
      style={[s.card, unread ? s.cardUnread : null, selected ? s.cardSelected : null]}
    >
      <Pressable
        style={s.checkbox}
        onPress={() => onToggleSelected(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={t("notifications.selectRowA11yLabel")}
        hitSlop={8}
      >
        <MaterialCommunityIcons
          name={selected ? "checkbox-marked" : "checkbox-blank-outline"}
          size={NotificationsLayout.checkboxSize}
          color={NotificationsPalette.textPrimary}
        />
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          s.content,
          pressed ? { opacity: LoginInteraction.pressedOpacity } : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${moduleLabel} ${item.title} #${item.caseNumber} ${item.receivedAt}`.trim()}
        accessibilityHint={
          unread ? t("notifications.markRowReadA11yHint") : undefined
        }
        onPress={() => onPress(item)}
      >
        <View style={s.metaRow}>
          <Text style={s.module} numberOfLines={1}>
            {moduleLabel}
          </Text>
          <Text style={s.date}>{item.receivedAt}</Text>
        </View>
        <Text style={[s.title, unread ? s.titleUnread : null]}>
          {item.title}
        </Text>
        <Text style={[s.caseNumber, unread ? s.caseNumberUnread : null]}>
          {`#${item.caseNumber}`}
        </Text>
        <Text style={s.body} numberOfLines={1} ellipsizeMode="tail">
          {item.body}
        </Text>
      </Pressable>
    </View>
  );
}
