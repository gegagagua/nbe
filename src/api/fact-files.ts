import type { ResponseType } from "axios";

import { ApiPaths, BASE_URL } from "@/constants/api";
import { apiClient } from "@/lib/api-client";

/**
 * Download a single protocol file as binary.
 *
 * POST {BASE_URL}/file-portal/v1/fact/files/stream with a
 * `{ data: { appId, fileId } }` body (Bearer-only, mirrors `streamEpsFile`).
 * Returns the raw payload; the caller picks the responseType (`blob` on web,
 * `arraybuffer` on native).
 */
export async function streamFactFile(
  appId: number | string,
  fileId: number | string,
  responseType: ResponseType,
): Promise<unknown> {
  const res = await apiClient.post(
    `${BASE_URL}${ApiPaths.factFilesStream}`,
    { data: { appId, fileId } },
    { responseType },
  );
  return res.data;
}
