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
      // Re-fetch the detail so the screen shows the freshly saved backend values.
      queryClient.invalidateQueries({ queryKey: ['debtor-app', appId] });
    },
    onError: (error) => {
      showErrorToast(i18n.t('debtors.detailEditError'), error);
    },
  });
}
