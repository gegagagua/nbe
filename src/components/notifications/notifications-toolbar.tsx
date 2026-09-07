import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import {
  NotificationsLayout,
  NotificationsPalette,
} from "@/constants/notifications";
import type { NotificationSelectPreset } from "@/types/notifications";

import { notificationsToolbarStyles as s } from "./notifications-toolbar.styles";

const SELECT_PRESETS: NotificationSelectPreset[] = ["all", "read", "unread"];

type MenuAnchor = { top: number; left: number };

type Props = {
  /** how many rows are currently ticked */
  selectedCount: number;
  /** true when every visible row is ticked — drives the checkbox glyph */
  allSelected: boolean;
  onSelectPreset: (preset: NotificationSelectPreset) => void;
  onMarkSelectedRead: () => void;
  onMarkAllRead: () => void;
  busy: boolean;
};

/**
 * Row above the feed: a checkbox dropdown that bulk-ticks notifications
 * (all / read / unread / none) plus the mark-as-read action.
 */
export function NotificationsToolbar({
  selectedCount,
  allSelected,
  onSelectPreset,
  onMarkSelectedRead,
  onMarkAllRead,
  busy,
}: Props) {
  const { t } = useTranslation();
  const toggleRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);

  const hasSelection = selectedCount > 0;
  const actionDisabled = busy;

  const openMenu = () => {
    toggleRef.current?.measureInWindow((x, y, _width, height) => {
      setAnchor({ top: y + height + NotificationsLayout.menuOffset, left: x });
    });
  };

  const checkboxIcon = allSelected
    ? "checkbox-marked"
    : hasSelection
      ? "minus-box"
      : "checkbox-blank-outline";

  return (
    <View style={s.bar}>
      <View ref={toggleRef} collapsable={false}>
        <Pressable
          style={s.toggle}
          onPress={openMenu}
          accessibilityRole="button"
          accessibilityLabel={t("notifications.selectMenuA11yLabel")}
        >
          <MaterialCommunityIcons
            name={checkboxIcon}
            size={NotificationsLayout.checkboxSize}
            color={NotificationsPalette.textPrimary}
          />
          <MaterialCommunityIcons
            name="menu-down"
            size={NotificationsLayout.checkboxSize}
            color={NotificationsPalette.textPrimary}
          />
        </Pressable>
      </View>

      <Pressable
        style={s.action}
        disabled={actionDisabled}
        onPress={hasSelection ? onMarkSelectedRead : onMarkAllRead}
        accessibilityRole="button"
        accessibilityState={{ disabled: actionDisabled }}
      >
        <Text
          style={[s.actionLabel, actionDisabled ? s.actionLabelDisabled : null]}
        >
          {hasSelection
            ? t("notifications.markSelectedRead", { count: selectedCount })
            : t("notifications.markAllRead")}
        </Text>
      </Pressable>

      <Modal
        transparent
        visible={anchor !== null}
        animationType="fade"
        onRequestClose={() => setAnchor(null)}
      >
        <View style={s.menuScrim}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setAnchor(null)}
            accessibilityRole="button"
            accessibilityLabel={t("notifications.selectMenuCloseA11yLabel")}
          />
          {anchor && (
            <View style={[s.menu, { top: anchor.top, left: anchor.left }]}>
              <Text style={s.menuHeader}>{t("notifications.selectMenuTitle")}</Text>
              {SELECT_PRESETS.map((preset) => (
                <Pressable
                  key={preset}
                  style={s.menuItem}
                  accessibilityRole="button"
                  onPress={() => {
                    onSelectPreset(preset);
                    setAnchor(null);
                  }}
                >
                  <Text style={s.menuItemText}>
                    {t(`notifications.selectOptions.${preset}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
