import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { caseDetailPanelStyles as p } from "./case-detail-panels.styles";
import { caseDetailTableStyles as tb } from "./case-detail-tables.styles";

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
}: {
  title?: string;
  rows: KeyValueRow[];
}) {
  return (
    <View style={tb.borderBox}>
      {title ? <Text style={p.panelTitle}>{title}</Text> : null}
      {rows.map((row, i) => (
        <View
          key={`${row.label}-${i}`}
          style={[tb.kvRow, i < rows.length - 1 ? tb.borderBottom : null]}
        >
          <Text style={tb.kvLabel}>{row.label}</Text>
          <View style={tb.kvValue}>
            {typeof row.value === "string" || typeof row.value === "number" ? (
              <Text style={tb.kvValueText}>{row.value}</Text>
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
  return <View style={tb.kvCardList}>{children}</View>;
}
