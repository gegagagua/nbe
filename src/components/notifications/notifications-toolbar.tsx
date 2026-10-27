import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme";
import type { NotificationSelectPreset } from "@/types/notifications";

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
  const { colors, shadows } = useAppTheme();
  const toggleRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);

  const hasSelection = selectedCount > 0;
  const actionDisabled = busy;

  const openMenu = () => {
    toggleRef.current?.measureInWindow((x, y, _width, height) => {
      setAnchor({ top: y + height + 4, left: x });
    });
  };

  const checkboxIcon = allSelected
    ? "checkbox-marked"
    : hasSelection
      ? "minus-box"
      : "checkbox-blank-outline";

  return (
    <View className="flex-row items-center justify-between gap-2">
      <View ref={toggleRef} collapsable={false}>
        <Pressable
          className="h-10 flex-row items-center gap-1 rounded-lg border border-border bg-surface px-2"
          onPress={openMenu}
          accessibilityRole="button"
          accessibilityLabel={t("notifications.selectMenuA11yLabel")}
        >
          <MaterialCommunityIcons
            name={checkboxIcon}
            size={22}
            color={colors.text}
          />
          <MaterialCommunityIcons name="menu-down" size={22} color={colors.text} />
        </Pressable>
      </View>

      <Pressable
        className="h-10 justify-center px-2"
        disabled={actionDisabled}
        onPress={hasSelection ? onMarkSelectedRead : onMarkAllRead}
        accessibilityRole="button"
        accessibilityState={{ disabled: actionDisabled }}
      >
        <Text
          className={`text-label font-semibold ${
            actionDisabled ? "text-fg-disabled" : "text-primary"
          }`}
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
        <View className="flex-1">
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setAnchor(null)}
            accessibilityRole="button"
            accessibilityLabel={t("notifications.selectMenuCloseA11yLabel")}
          />
          {anchor && (
            <View
              className="absolute min-w-[180px] rounded-lg border border-border bg-surface-elevated py-1"
              style={[{ top: anchor.top, left: anchor.left }, shadows.lg]}
            >
              <Text className="px-4 py-2 text-caption text-fg-muted">
                {t("notifications.selectMenuTitle")}
              </Text>
              {SELECT_PRESETS.map((preset) => (
                <Pressable
                  key={preset}
                  className="px-4 py-2 active:bg-surface-pressed"
                  accessibilityRole="button"
                  onPress={() => {
                    onSelectPreset(preset);
                    setAnchor(null);
                  }}
                >
                  <Text className="text-body text-fg">
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
