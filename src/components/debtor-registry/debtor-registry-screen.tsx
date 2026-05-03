import { USE_DEBTOR_REGISTRY_LIST_MOCK } from '@/constants/debtor-registry-layout-mock';
import { useSessionUserProfile } from '@/hooks/use-session-user-profile';

import { DebtorRegistryScreenLive } from './debtor-registry-screen-live';
import { DebtorRegistryScreenMock } from './debtor-registry-screen-mock';

export function DebtorRegistryScreen() {
  const { displayName } = useSessionUserProfile();
  if (USE_DEBTOR_REGISTRY_LIST_MOCK) {
    return <DebtorRegistryScreenMock displayName={displayName} />;
  }
  return <DebtorRegistryScreenLive displayName={displayName} />;
}
