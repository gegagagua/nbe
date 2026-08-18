import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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

/** Single-select read-state filter shown above the notifications feed. */
export function NotificationsFilter({ value, onChange }: Props) {
  const { t } = useTranslation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const optionLabel = (option: NotificationFilterValue) =>
    t(`notifications.filterOptions.${option}`);

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
      <Pressable
        style={s.select}
        onPress={() => setIsSheetOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t("notifications.filterSelectA11yLabel")}
        accessibilityValue={{ text: optionLabel(value) }}
      >
        <Text style={s.selectText}>{optionLabel(value)}</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={NotificationsLayout.chevronSize}
          color={NotificationsPalette.textPrimary}
        />
      </Pressable>

      <Modal
        transparent
        visible={isSheetOpen}
        animationType="fade"
        onRequestClose={() => setIsSheetOpen(false)}
      >
        <View style={s.scrim}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setIsSheetOpen(false)}
            accessibilityRole="button"
            accessibilityLabel={t("notifications.filterCloseA11yLabel")}
          />
          <View style={s.sheet}>
            {FILTER_OPTIONS.map((option) => {
              const isSelected = option === value;
              return (
                <Pressable
                  key={option}
                  style={[s.option, isSelected ? s.optionSelected : null]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    onChange(option);
                    setIsSheetOpen(false);
                  }}
                >
                  <Text
                    style={[
                      s.optionText,
                      isSelected ? s.optionTextSelected : null,
                    ]}
                  >
                    {optionLabel(option)}
                  </Text>
                  {isSelected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={NotificationsLayout.chevronSize}
                      color={NotificationsPalette.textPrimary}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}
