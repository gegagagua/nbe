import type {
  FactProtocolFile,
  FactProtocolStatus,
  FactStatusEntryResponse,
  FactStatusFileEntryResponse,
  FactStatusFilesResponse,
} from "@/types/facts";

/** "2026-07-10T09:39:36" → "10.07.2026 09:39" (dot date, matches map-fact-detail). */
function formatDateTime(raw: string | null | undefined): string {
  if (!raw) return "";
  const [datePart, timePart] = raw.split("T");
  const match = datePart?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = match ? `${match[3]}.${match[2]}.${match[1]}` : (datePart ?? "");
  const hhmm = (timePart ?? "").slice(0, 5);
  return hhmm ? `${date} ${hhmm}` : date;
}

/**
 * The rows may sit directly under `data` (EPS parity) or one level deeper
 * (`data.content` / `data.data` — the paged wrappers other fact-portal routes
 * use). Accept all three so a wrapper difference can't blank the tab.
 */
function fileEntries(
  envelope: FactStatusFilesResponse,
): FactStatusFileEntryResponse[] {
  const data: unknown = envelope?.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const inner = data as { content?: unknown; data?: unknown };
    if (Array.isArray(inner.content)) return inner.content;
    if (Array.isArray(inner.data)) return inner.data;
  }
  return [];
}

/** Map the status-files response into downloadable file rows. */
export function mapFactStatusFiles(
  envelope: FactStatusFilesResponse,
): FactProtocolFile[] {
  return fileEntries(envelope)
    .map((entry) => {
      // Meta usually nests under `file` (EPS parity), but tolerate rows that
      // inline the same fields on the entry itself.
      const file =
        entry.file ??
        ((entry as { fileName?: unknown }).fileName != null
          ? (entry as unknown as NonNullable<FactStatusFileEntryResponse["file"]>)
          : null);
      if (file == null || file.id == null) return null;
      const fileName = file.fileName?.trim() ?? "";
      return {
        fileId: file.id,
        title: file.fileDesc?.trim() || fileName,
        fileName,
        mimeType: file.mimeType?.trim() ?? "",
        uploadedBy: entry.uploadedBy?.name?.trim() ?? "",
        createdDate: formatDateTime(entry.createdDate),
      };
    })
    .filter((row): row is FactProtocolFile => row != null);
}

/** Combine a status entry with its (separately fetched) files. */
export function mapFactProtocolStatus(
  entry: FactStatusEntryResponse,
  files: FactProtocolFile[],
): FactProtocolStatus {
  return {
    appStatusId: entry.id,
    appId: entry.appId,
    statusName: entry.status?.name?.trim() ?? "",
    statusNumber: entry.statusNumber?.trim() ?? "",
    date: formatDateTime(entry.createdDate),
    files,
  };
}
