import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  clearActiveLegalEntity,
  getActiveLegalEntity,
  setActiveLegalEntity,
} from "@/lib/active-legal-entity-storage";
import type { LegalEntity } from "@/types/users";

/**
 * The legal entity the user is currently acting as, or `null` when acting as
 * themselves. Re-read on focus so a switch made on another screen shows up.
 */
export function useActiveLegalEntity() {
  const [entity, setEntity] = useState<LegalEntity | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getActiveLegalEntity().then((e) => {
        if (active) setEntity(e);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const switchToPersonal = useCallback(async () => {
    await clearActiveLegalEntity();
    setEntity(null);
  }, []);

  const switchToLegal = useCallback(async (next: LegalEntity) => {
    await setActiveLegalEntity(next);
    setEntity(next);
  }, []);

  return { entity, switchToPersonal, switchToLegal };
}
