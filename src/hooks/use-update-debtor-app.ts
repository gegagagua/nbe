import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateDebtorApp } from '@/api/debtor-apps';
import i18n from '@/i18n/i18n';
import { showErrorToast } from '@/lib/show-error-toast';
import type { UpdateDebtorAppRequestedPerson } from '@/types/debtor-registry';

export function useUpdateDebtorApp(appId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestedPerson: UpdateDebtorAppRequestedPerson) =>
      updateDebtorApp(appId as number, requestedPerson),
    onSuccess: () => {
      // Re-fetch the detail so the screen shows the freshly saved backend values,
      // and the list so the row reflects the edit when navigating back.
      queryClient.invalidateQueries({ queryKey: ['debtor-app', appId] });
      queryClient.invalidateQueries({ queryKey: ['debtor-apps'] });
    },
    onError: (error) => {
      showErrorToast(i18n.t('debtors.detailEditError'), error);
    },
  });
}
