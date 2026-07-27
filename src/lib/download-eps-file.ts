import type { ResponseType } from "axios";
import { Platform } from "react-native";

import { streamEpsFile } from "@/api/eps-files";

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

export type PreparedFile = {
  uri: string;
  fileName: string;
  mimeType?: string;
  uti?: string;
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
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

export async function prepareEpsFile(
  params: StreamParams,
): Promise<PreparedFile | null> {
  return prepareStreamedFile(
    (responseType) =>
      streamEpsFile(params.appId, params.fileId, params.userId, responseType),
    { fileId: params.fileId, fileName: params.fileName },
  );
}

export async function prepareStreamedFile(
  stream: (responseType: ResponseType) => Promise<unknown>,
  opts: { fileId: number | string; fileName: string },
): Promise<PreparedFile | null> {
  const { fileId, fileName } = opts;

  if (Platform.OS === "web") {
    const data = (await stream("blob")) as Blob;
    triggerWebDownload(data, fileName);
    return null;
  }

  const buffer = (await stream("arraybuffer")) as ArrayBuffer;
  const base64 = arrayBufferToBase64(buffer);

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

export async function openAndroidViewer(file: PreparedFile): Promise<void> {
  const { getContentUriAsync } = await import("expo-file-system/legacy");
  const contentUri = await getContentUriAsync(file.uri);
  const IntentLauncher = await import("expo-intent-launcher");
  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    data: contentUri,
    flags: 1,
    type: file.mimeType,
  });
}

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
