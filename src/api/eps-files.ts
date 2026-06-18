import type { ResponseType } from "axios";

import { ApiPaths, EpsFileApiBase } from "@/constants/api";
import { apiClient } from "@/lib/api-client";

/**
 * Download a single status file as binary.
 *
 * POST {EpsFileApiBase}/portal/v1/eps/files/stream with `x-user-id` and a
 * `{ data: { appId, fileId } }` body. Returns the raw file payload; the caller
 * picks the responseType (`blob` on web, `arraybuffer` on native).
 */
export async function streamEpsFile(
  appId: number | string,
  fileId: number | string,
  userId: number | string,
  responseType: ResponseType,
): Promise<unknown> {
  const res = await apiClient.post(
    `${EpsFileApiBase}${ApiPaths.epsFilesStream}`,
    { data: { appId, fileId } },
    {
      headers: { "x-user-id": String(userId) },
      responseType,
    },
  );
  return res.data;
}
