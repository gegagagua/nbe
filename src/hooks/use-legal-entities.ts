import { useCallback, useState } from "react";

import { getLegalEntities } from "@/api/users";
import type { LegalEntity } from "@/types/users";

export function useLegalEntities() {
  const [entities, setEntities] = useState<LegalEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEntities = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getLegalEntities();
      setEntities(data);
    } catch (err: unknown) {
      console.error("[useLegalEntities]", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { entities, isLoading, refetch: fetchEntities };
}
