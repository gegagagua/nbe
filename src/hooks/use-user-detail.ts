import { useCallback, useEffect, useState } from "react";

import { getUserMe } from "@/api/users";
import type { UserDetail } from "@/types/users";

export function useUserDetail() {
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUserMe();
      setDetail(data);
    } catch (err: unknown) {
      console.error("[useUserDetail]", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return { detail, isLoading, refetch: fetchDetail };
}
