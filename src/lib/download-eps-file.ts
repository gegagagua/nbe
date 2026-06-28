import { Platform } from "react-native";

import { streamEpsFile } from "@/api/eps-files";

/** Map a file extension to the iOS UTI + mime type used by the share sheet. */
const SHARE_TYPE_BY_EXT: Record<string, { mimeType: string; uti: string }> = {
  pdf: { mimeType: "application/pdf", uti: "com.adobe.pdf" },
  png: { mimeType: "image/png", uti: "public.png" },
  jpg: { mimeType: "image/jpeg", uti: "public.jpeg" },
  jpeg: { mimeType: "image/jpeg", uti: "public.jpeg" },
  doc: { mimeType: "application/msword", uti: "com.microsoft.word.doc" },
  docx: {
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    uti: "org.openxmlformats.wordprocessingml.document",
  },
  xls: { mimeType: "application/vnd.ms-excel", uti: "com.microsoft.excel.xls" },
  xlsx: {
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    uti: "org.openxmlformats.spreadsheetml.sheet",
  },
};

function shareTypeForName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return SHARE_TYPE_BY_EXT[ext];
}

/** A status file streamed and written to the on-device cache, ready to open. */
export type PreparedFile = {
  uri: string;
  fileName: string;
  mimeType?: string;
  uti?: string;
};

/** Convert an ArrayBuffer to a base64 string (for writing on native). */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  // global.btoa exists on web/Hermes; fall back to Buffer if not.
  if (typeof btoa === "function") return btoa(binary);
  return Buffer.from(binary, "binary").toString("base64");
}

function triggerWebDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "file";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

type StreamParams = {
  appId: number | string;
  fileId: number | string;
  fileName: string;
  userId: number | string;
};

/**
 * Stream a status file so the user can read it.
 *
 * - Web: streams a Blob and triggers a browser download, then returns `null`
 *   (there is nothing further to open in-app).
 * - Native: streams the bytes, writes them to the cache, and returns the local
 *   file so the caller can open it — Android in a viewer app, iOS in the in-app
 *   reader (so the file opens directly instead of going straight to the share
 *   sheet that forces "save to Drive / copy elsewhere").
 */
export async function prepareEpsFile(
  params: StreamParams,
): Promise<PreparedFile | null> {
  const { appId, fileId, fileName, userId } = params;

  if (Platform.OS === "web") {
    const data = (await streamEpsFile(appId, fileId, userId, "blob")) as Blob;
    triggerWebDownload(data, fileName);
    return null;
  }

  const buffer = (await streamEpsFile(
    appId,
    fileId,
    userId,
    "arraybuffer",
  )) as ArrayBuffer;
  const base64 = arrayBufferToBase64(buffer);

  // expo-file-system (new API) ships with Expo; write to cache then open.
  const { File, Paths } = await import("expo-file-system");
  const safeName = fileName || `file-${fileId}`;
  const file = new File(Paths.cache, safeName);
  file.create({ overwrite: true });
  file.write(base64, { encoding: "base64" });

  const shareType = shareTypeForName(safeName);
  return {
    uri: file.uri,
    fileName: safeName,
    mimeType: shareType?.mimeType,
    uti: shareType?.uti,
  };
}

/** Open a cached file in the Android default viewer via an ACTION_VIEW intent. */
export async function openAndroidViewer(file: PreparedFile): Promise<void> {
  // ACTION_VIEW needs a content:// URI (file:// is blocked by FileProvider).
  const { getContentUriAsync } = await import("expo-file-system/legacy");
  const contentUri = await getContentUriAsync(file.uri);
  const IntentLauncher = await import("expo-intent-launcher");
  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    data: contentUri,
    // FLAG_GRANT_READ_URI_PERMISSION so the viewer app can read the file.
    flags: 1,
    type: file.mimeType,
  });
}

/** Present a cached file through the OS share sheet (download / share / save). */
export async function shareCachedFile(file: PreparedFile): Promise<void> {
  const Sharing = await import("expo-sharing");
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing is not available on this device");
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: file.mimeType,
    UTI: file.uti,
  });
}
