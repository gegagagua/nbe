import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { useAppTheme } from "@/theme";

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
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(false);
  const selected = parse(value);
  const [view, setView] = useState(() => {
    const now = new Date();
    return { y: selected?.y ?? now.getFullYear(), m: selected?.m ?? now.getMonth() };
  });

  // Lay the month out as fixed rows of 7. Rendering each week as a `flex-row`
  // of `flex-1` cells (instead of a single `flex-wrap` list of `w-[14.2857%]`
  // cells) guarantees exactly 7 columns per row: 7×14.2857% rounds just over
  // 100% at some pixel densities, which wrapped the 7th day onto the next line
  // and left the Sunday column empty, shifting every date off its weekday.
  const weeks = useMemo(() => {
    const firstWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Mon-first
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const flat: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i += 1) flat.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) flat.push(d);
    while (flat.length % 7 !== 0) flat.push(null); // pad the final row to 7
    const rows: (number | null)[][] = [];
    for (let i = 0; i < flat.length; i += 7) rows.push(flat.slice(i, i + 7));
    return rows;
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
      <Pressable
        className="w-full flex-row items-center justify-between rounded-md border border-input-border bg-input px-3 min-h-[50px]"
        onPress={openPicker}
        accessibilityRole="button"
      >
        <Text className={value ? "text-body text-fg" : "text-body text-input-placeholder"}>
          {value || placeholder}
        </Text>
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={18}
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
            className="w-full max-w-[340px] rounded-xl bg-surface p-4 gap-3"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between">
              <Pressable
                className="p-1 rounded-md"
                onPress={() => shiftMonth(-1)}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={colors.text}
                />
              </Pressable>
              <Text className="text-subtitle font-bold text-fg">
                {months[view.m]} {view.y}
              </Text>
              <Pressable
                className="p-1 rounded-md"
                onPress={() => shiftMonth(1)}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={colors.text}
                />
              </Pressable>
            </View>

            <View className="flex-row">
              {weekdays.map((w) => (
                <View key={w} className="flex-1 items-center py-1">
                  <Text className="text-label font-semibold text-fg-muted">{w}</Text>
                </View>
              ))}
            </View>

            <View>
              {weeks.map((week, wi) => (
                // eslint-disable-next-line react/no-array-index-key
                <View key={`week-${wi}`} className="flex-row">
                  {week.map((day, di) => {
                    if (day === null) {
                      return (
                        <View
                          // eslint-disable-next-line react/no-array-index-key
                          key={`blank-${wi}-${di}`}
                          className="flex-1 aspect-square items-center justify-center"
                        />
                      );
                    }
                    const isSelected =
                      !!selected &&
                      selected.y === view.y &&
                      selected.m === view.m &&
                      selected.d === day;
                    return (
                      <Pressable
                        key={day}
                        className="flex-1 aspect-square items-center justify-center"
                        onPress={() => pick(day)}
                        accessibilityRole="button"
                      >
                        <View
                          className={[
                            "w-[34px] h-[34px] rounded-full items-center justify-center",
                            isSelected ? "bg-primary" : "",
                          ].join(" ")}
                        >
                          <Text
                            className={
                              isSelected
                                ? "text-on-primary font-bold"
                                : "text-fg"
                            }
                          >
                            {day}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            <View className="flex-row justify-end gap-4 mt-1">
              <Pressable
                className="py-1 px-2"
                onPress={() => {
                  onChange("");
                  setOpen(false);
                }}
                accessibilityRole="button"
              >
                <Text className="text-primary font-bold">{clearLabel}</Text>
              </Pressable>
              <Pressable
                className="py-1 px-2"
                onPress={() => setOpen(false)}
                accessibilityRole="button"
              >
                <Text className="text-fg font-semibold">{closeLabel}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
