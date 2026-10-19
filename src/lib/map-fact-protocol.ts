import type {
  FactProtocolFile,
  FactProtocolStatus,
  FactStatusEntryResponse,
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

/** Map the status-files response into downloadable file rows. */
export function mapFactStatusFiles(
  envelope: FactStatusFilesResponse,
): FactProtocolFile[] {
  return (envelope.data ?? [])
    .filter((entry) => entry.file != null)
    .map((entry) => {
      const file = entry.file!;
      const fileName = file.fileName?.trim() ?? "";
      return {
        fileId: file.id,
        title: file.fileDesc?.trim() || fileName,
        fileName,
        mimeType: file.mimeType?.trim() ?? "",
        uploadedBy: entry.uploadedBy?.name?.trim() ?? "",
        createdDate: formatDateTime(entry.createdDate),
      };
    });
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
