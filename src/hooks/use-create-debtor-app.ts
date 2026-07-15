import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createDebtorApp } from '@/api/debtor-apps';
import i18n from '@/i18n/i18n';
import { showErrorToast } from '@/lib/show-error-toast';
import type { UpdateDebtorAppRequestedPerson } from '@/types/debtor-registry';

export function useCreateDebtorApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestedPerson: UpdateDebtorAppRequestedPerson) =>
      createDebtorApp(requestedPerson),
    onSuccess: () => {
      // The registry list now has one more application.
      queryClient.invalidateQueries({ queryKey: ['debtor-apps'] });
    },
    onError: (error) => {
      showErrorToast(i18n.t('debtors.extractRecordError'), error);
    },
  });
}
