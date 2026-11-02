import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { useAppTheme } from "@/theme";

export type SelectOption = { value: string; label: string };

type Props = {
  /** Selected option value, or "" when nothing is picked. */
  value: string;
  onChange: (next: string) => void;
  options: SelectOption[];
  placeholder: string;
  /** Modal header title. */
  title: string;
  closeA11yLabel: string;
};

/**
 * Lightweight modal-based picker (no native module). Mirrors `DatePickerField`:
 * labels/options are passed in so the caller owns localization.
 */
export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  title,
  closeA11yLabel,
}: Props) {
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        className="w-full flex-row items-center justify-between gap-2 rounded-md border border-input-border bg-input px-3 py-1 min-h-[50px]"
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <Text
          className={selected ? "flex-1 text-body text-fg" : "flex-1 text-body text-input-placeholder"}
          numberOfLines={1}
        >
          {selected?.label || placeholder}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={colors.textMuted}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center p-4"
          style={{ backgroundColor: colors.overlay }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            className="w-full max-w-[360px] max-h-[70%] rounded-xl bg-surface p-4 gap-3"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between gap-2">
              <Text className="flex-1 text-subtitle font-bold text-fg">{title}</Text>
              <Pressable
                className="p-1 rounded-md"
                onPress={() => setOpen(false)}
                accessibilityRole="button"
                accessibilityLabel={closeA11yLabel}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color={colors.text}
                />
              </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {options.map((o) => {
                const isOn = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    className={[
                      "flex-row items-center justify-between gap-2 py-4 px-3 rounded-md",
                      isOn ? "bg-surface-sunken" : "",
                    ].join(" ")}
                    onPress={() => pick(o.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isOn }}
                  >
                    <Text
                      className={[
                        "flex-1 text-body text-fg",
                        isOn ? "font-bold" : "",
                      ].join(" ")}
                    >
                      {o.label}
                    </Text>
                    {isOn ? (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={colors.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
