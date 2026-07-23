import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createDebtorApp, getDebtorAppPersons } from '@/api/debtor-apps';
import i18n from '@/i18n/i18n';
import { showErrorToast } from '@/lib/show-error-toast';
import type {
  CreatedDebtorApp,
  UpdateDebtorAppRequestedPerson,
} from '@/types/debtor-registry';

export type CreateDebtorAppResult = {
  app: CreatedDebtorApp;
  payCode: string | null;
};

export function useCreateDebtorApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      requestedPerson: UpdateDebtorAppRequestedPerson,
    ): Promise<CreateDebtorAppResult> => {
      const app = await createDebtorApp(requestedPerson);
      let payCode: string | null = null;
      try {
        const persons = await getDebtorAppPersons(app.id);
        payCode = persons[0]?.payCode ?? null;
      } catch {
        payCode = null;
      }
      return { app, payCode };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debtor-apps'] });
    },
    onError: (error) => {
      showErrorToast(i18n.t('debtors.extractRecordError'), error);
    },
  });
}
