import { createContext, useContext, type ReactNode } from 'react';

import { useRegisterFlow, type RegisterFlow } from '@/hooks/use-register-flow';

const RegisterFlowContext = createContext<RegisterFlow | null>(null);

/**
 * Holds the registration flow state (entered values, created user id, Identomat
 * verification) so it survives across the separate `/register/*` step routes.
 * Mounted once by the register stack layout; unmounts — and therefore resets —
 * when the user leaves the register flow entirely.
 */
export function RegisterFlowProvider({ children }: { children: ReactNode }) {
  const flow = useRegisterFlow();
  return (
    <RegisterFlowContext.Provider value={flow}>
      {children}
    </RegisterFlowContext.Provider>
  );
}

export function useRegisterFlowContext(): RegisterFlow {
  const flow = useContext(RegisterFlowContext);
  if (!flow) {
    throw new Error(
      'useRegisterFlowContext must be used within a RegisterFlowProvider',
    );
  }
  return flow;
}
