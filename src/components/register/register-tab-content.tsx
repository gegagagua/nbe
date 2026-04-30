import type { RegisterTabKind } from '@/types/register';

import { RegisterLegalForm } from './register-legal-form';
import { RegisterPhysicalForm } from './register-physical-form';

export function RegisterTabContent({ tab }: { tab: RegisterTabKind }) {
  if (tab === 'legal') {
    return <RegisterLegalForm />;
  }
  return <RegisterPhysicalForm />;
}
