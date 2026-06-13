import { useSessionUserProfile } from "@/hooks/use-session-user-profile";

import { DebtorRegistryScreenLive } from "./debtor-registry-screen-live";

export function DebtorRegistryScreen() {
  const { displayName } = useSessionUserProfile();
  return <DebtorRegistryScreenLive displayName={displayName} />;
}
