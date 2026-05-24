import type { RegisterPhysicalValues } from '@/types/register-form-values';
import type { RegisterTabKind } from '@/types/register';

import { RegisterLegalForm } from './register-legal-form';
import { RegisterPhysicalForm } from './register-physical-form';

type Props = {
  tab: RegisterTabKind;
  onPhysicalSubmit: (values: RegisterPhysicalValues) => void;
};

export function RegisterTabContent({ tab, onPhysicalSubmit }: Props) {
  if (tab === 'legal') {
    return <RegisterLegalForm />;
  }
  return <RegisterPhysicalForm onValidSubmit={onPhysicalSubmit} />;
}
