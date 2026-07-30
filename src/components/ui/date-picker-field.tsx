import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { DebtorRegistryPalette } from "@/constants/debtor-registry";

import { datePickerFieldStyles as s } from "./date-picker-field.styles";

type Props = {
  /** Selected date as `YYYY-MM-DD`, or "" when unset. */
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  /** 7 short weekday labels, Monday-first. */
  weekdays: string[];
  /** 12 month labels, January-first. */
  months: string[];
  clearLabel: string;
  closeLabel: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const format = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function parse(value: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]) - 1, d: Number(match[3]) };
}

/**
 * Pure-JS calendar date picker (no native module) that returns a `YYYY-MM-DD`
 * string. Labels are passed in so the caller controls localization.
 */
export function DatePickerField({
  value,
  onChange,
  placeholder,
  weekdays,
  months,
  clearLabel,
  closeLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = parse(value);
  const [view, setView] = useState(() => {
    const now = new Date();
    return { y: selected?.y ?? now.getFullYear(), m: selected?.m ?? now.getMonth() };
  });

  const cells = useMemo(() => {
    const firstWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Mon-first
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const out: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i += 1) out.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) out.push(d);
    return out;
  }, [view.y, view.m]);

  const openPicker = () => {
    const base = parse(value);
    if (base) setView({ y: base.y, m: base.m });
    setOpen(true);
  };

  const shiftMonth = (delta: number) =>
    setView((v) => {
      const next = v.m + delta;
      return { y: v.y + Math.floor(next / 12), m: ((next % 12) + 12) % 12 };
    });

  const pick = (day: number) => {
    onChange(format(view.y, view.m, day));
    setOpen(false);
  };

  return (
    <>
      <Pressable style={s.field} onPress={openPicker} accessibilityRole="button">
        <Text style={value ? s.fieldText : s.placeholder}>
          {value || placeholder}
        </Text>
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={18}
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
              <Pressable
                style={s.navBtn}
                onPress={() => shiftMonth(-1)}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={DebtorRegistryPalette.textPrimary}
                />
              </Pressable>
              <Text style={s.headerTitle}>
                {months[view.m]} {view.y}
              </Text>
              <Pressable
                style={s.navBtn}
                onPress={() => shiftMonth(1)}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={DebtorRegistryPalette.textPrimary}
                />
              </Pressable>
            </View>

            <View style={s.weekRow}>
              {weekdays.map((w) => (
                <View key={w} style={s.weekCell}>
                  <Text style={s.weekText}>{w}</Text>
                </View>
              ))}
            </View>

            <View style={s.grid}>
              {cells.map((day, index) => {
                if (day === null) {
                  // eslint-disable-next-line react/no-array-index-key
                  return <View key={`blank-${index}`} style={s.dayCell} />;
                }
                const isSelected =
                  !!selected &&
                  selected.y === view.y &&
                  selected.m === view.m &&
                  selected.d === day;
                return (
                  <Pressable
                    key={day}
                    style={s.dayCell}
                    onPress={() => pick(day)}
                    accessibilityRole="button"
                  >
                    <View style={[s.dayInner, isSelected && s.daySelected]}>
                      <Text style={isSelected ? s.daySelectedText : s.dayText}>
                        {day}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={s.footer}>
              <Pressable
                style={s.footerBtn}
                onPress={() => {
                  onChange("");
                  setOpen(false);
                }}
                accessibilityRole="button"
              >
                <Text style={s.footerClear}>{clearLabel}</Text>
              </Pressable>
              <Pressable
                style={s.footerBtn}
                onPress={() => setOpen(false)}
                accessibilityRole="button"
              >
                <Text style={s.footerText}>{closeLabel}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
