import type { ReactNode } from "react";
import { Text, View } from "react-native";

export type KeyValueRow = {
  label: string;
  /** A string is rendered as right-aligned value text; a node is rendered as-is. */
  value: ReactNode;
};

/**
 * Renders a single record as a vertical "label : value" card. Replaces the
 * horizontal tables on the case-detail sub-tabs, which were unreadable on
 * narrow screens.
 */
export function CaseDetailKvCard({
  title,
  rows,
  accentColor,
}: {
  title?: string;
  rows: KeyValueRow[];
  /** Optional left-border accent, e.g. red for in-progress / green for done. */
  accentColor?: string;
}) {
  return (
    <View
      className="rounded-md border border-border"
      style={
        accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : null
      }
    >
      {title ? (
        <Text className="border-b border-border p-2 text-label font-bold text-primary">
          {title}
        </Text>
      ) : null}
      {rows.map((row, i) => (
        <View
          key={`${row.label}-${i}`}
          className={`flex-row items-start gap-2 p-2 ${
            i < rows.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <Text className="flex-1 text-caption text-fg-secondary">{row.label}</Text>
          <View className="flex-1 items-end gap-1">
            {typeof row.value === "string" || typeof row.value === "number" ? (
              <Text className="text-right text-label text-fg">{row.value}</Text>
            ) : (
              row.value
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

/** Vertical stack of cards with consistent spacing. */
export function CaseDetailKvCardList({ children }: { children: ReactNode }) {
  return <View className="mt-2 gap-4">{children}</View>;
}
