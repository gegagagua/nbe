import { useQuery } from "@tanstack/react-query";

import { getCaseExtraInfo } from "@/api/case-details";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { mapCaseExtraInfo } from "@/lib/map-case-detail";
import type { EpsCaseExtraInfoEnvelope } from "@/types/case-detail-api";

/**
 * Agency-provided "დამატებითი ინფორმაცია" (fine details) for a case — backs the
 * header "დეტალები" modal shown on 08/1 (administrative fine) cases. The data is
 * optional: the agency may send nothing, in which case the modal is empty.
 */
export function useCaseExtraInfo(
  appId: string,
  options?: { enabled?: boolean },
) {
  const { profile } = useSessionUserProfile();
  const userId = profile?.id;
  const canQuery =
    (options?.enabled ?? true) &&
    userId != null &&
    userId > 0 &&
    appId.trim().length > 0;

  return useQuery({
    queryKey: ["case-extra-info", userId, appId],
    enabled: canQuery,
    queryFn: async () => {
      const res = await getCaseExtraInfo(appId, userId!);
      return mapCaseExtraInfo(res as EpsCaseExtraInfoEnvelope);
    },
  });
}
