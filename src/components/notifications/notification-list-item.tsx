import { Pressable, Text, View } from "react-native";

import { LoginInteraction } from "@/constants/login";
import type { AppNotification } from "@/types/notifications";

import { notificationListItemStyles as s } from "./notification-list-item.styles";

type Props = {
  item: AppNotification;
  onPress?: (item: AppNotification) => void;
};

/** One row of the notifications feed — unread rows are bolder and outlined. */
export function NotificationListItem({ item, onPress }: Props) {
  const unread = !item.isRead;

  return (
    <Pressable
      style={({ pressed }) => [
        s.card,
        unread ? s.cardUnread : null,
        pressed ? { opacity: LoginInteraction.pressedOpacity } : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} #${item.caseNumber} ${item.date}`}
      onPress={() => onPress?.(item)}
    >
      <View style={s.headRow}>
        <Text style={[s.title, unread ? s.titleUnread : null]}>
          {item.title}
        </Text>
        <Text style={[s.date, unread ? s.dateUnread : null]}>{item.date}</Text>
      </View>
      <Text style={[s.caseNumber, unread ? s.caseNumberUnread : null]}>
        {`#${item.caseNumber}`}
      </Text>
      <Text style={s.body} numberOfLines={1} ellipsizeMode="tail">
        {item.body}
      </Text>
    </Pressable>
  );
}
