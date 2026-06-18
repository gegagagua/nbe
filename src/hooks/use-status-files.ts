import { useQuery } from "@tanstack/react-query";

import { getStatusFiles } from "@/api/case-details";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { mapStatusFiles } from "@/lib/map-case-detail";
import type { EpsStatusFilesEnvelope } from "@/types/case-detail-api";

/**
 * Files attached to a single proceeding status. Fetched lazily — pass
 * `enabled: true` only once the status row is expanded.
 */
export function useStatusFiles(
  appId: number | undefined,
  appStatusId: number | undefined,
  options?: { enabled?: boolean },
) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId != null &&
    appStatusId != null;

  return useQuery({
    queryKey: ["status-files", userId, appId, appStatusId],
    enabled: canQuery,
    queryFn: async () => {
      const res = await getStatusFiles(appId!, appStatusId!, userId!);
      return mapStatusFiles(res as EpsStatusFilesEnvelope);
    },
  });
}
