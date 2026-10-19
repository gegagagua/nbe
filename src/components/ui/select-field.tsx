import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { LoginPalette } from "@/constants/login";

import { selectFieldStyles as s } from "./select-field.styles";

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
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        style={s.field}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <Text
          style={selected ? s.fieldText : s.placeholder}
          numberOfLines={1}
        >
          {selected?.label || placeholder}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={DebtorRegistryPalette.textMuted}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={s.overlay} onPress={() => setOpen(false)}>
          <Pressable style={s.card} onPress={(e) => e.stopPropagation()}>
            <View style={s.header}>
              <Text style={s.headerTitle}>{title}</Text>
              <Pressable
                style={s.navBtn}
                onPress={() => setOpen(false)}
                accessibilityRole="button"
                accessibilityLabel={closeA11yLabel}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color={DebtorRegistryPalette.textPrimary}
                />
              </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {options.map((o) => {
                const isOn = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    style={[s.option, isOn && s.optionSelected]}
                    onPress={() => pick(o.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isOn }}
                  >
                    <Text
                      style={[s.optionText, isOn && s.optionTextSelected]}
                    >
                      {o.label}
                    </Text>
                    {isOn ? (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={LoginPalette.logoRed}
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
