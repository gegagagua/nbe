import type { FactAppDetail, FactAppDetailResponse } from "@/types/facts";

const text = (value: string | null | undefined) => value?.trim() ?? "";

/** "2026-07-10" / "2026-07-10T09:39:36" → "10.07.2026" (no timezone shift). */
function formatDay(value: string | null | undefined): string {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : text(value);
}

/** Joins a fixed day with a whole hour: "10.07.2026 10:00". */
function formatDayHour(day: string | null, hour: number | null): string {
  const time = hour == null ? "" : `${String(hour).padStart(2, "0")}:00`;
  return [formatDay(day), time].filter(Boolean).join(" ");
}

export function mapFactDetail(response: FactAppDetailResponse): FactAppDetail {
  const app = response.data;
  const note = app.appNote;

  return {
    id: app.id,
    regnumber: text(app.regnumber),
    date: formatDay(app.regDate ?? app.inputDate ?? app.createdDate),
    bureauName: text(app.agency?.name),
    factTimeFrom: formatDayHour(app.fixedDayFrom, app.fixedHourFrom),
    factTimeTo: formatDayHour(app.fixedDayTo, app.fixedHourTo),
    propertyType: text(note?.propertyType?.name),
    cadCode: text(note?.cadCode),
    propertyAddress: text(note?.propertyAddress),
    feeName: text(app.trService?.name),
    request: text(note?.request),
  };
}
