import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  createBogPaymentIntent,
  syncBogPaymentIntentStatus,
} from '@/api/guest-fine-payment';
import { showErrorToast } from '@/lib/show-error-toast';

export type DebtorPaymentInput = {
  appId: number;
  personId: number;
  amount: number;
};

export function useDebtorPayment() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const intentIdRef = useRef<string | null>(null);
  const appIdRef = useRef<number | null>(null);

  const mutation = useMutation({
    mutationFn: ({ appId, personId, amount }: DebtorPaymentInput) =>
      createBogPaymentIntent({
        destType: 'DEBTOR',
        appId,
        personId,
        amount,
        paymentMethod: 'CARD',
      }),
    onSuccess: (result) => {
      setPaymentUrl(result.paymentUrl);
      intentIdRef.current = result.paymentIntentId;
    },
    onError: (error) => showErrorToast(t('debtors.payError'), error),
  });

  const startPayment = useCallback(
    (input: DebtorPaymentInput) => {
      appIdRef.current = input.appId;
      mutation.mutate(input);
    },
    [mutation],
  );

  // Any close (manual or an auto-detected BOG redirect) pings sync-status so the
  // backend persists the outcome, then reloads the screens showing it.
  const closePayment = useCallback(() => {
    const intentId = intentIdRef.current;
    const appId = appIdRef.current;
    setPaymentUrl(null);
    intentIdRef.current = null;
    if (intentId == null) return;
    syncBogPaymentIntentStatus(intentId)
      .catch((error) => showErrorToast(t('debtors.payError'), error))
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: ['debtor-payments', appId] });
        queryClient.invalidateQueries({ queryKey: ['debtor-app', appId] });
        queryClient.invalidateQueries({ queryKey: ['debtor-apps'] });
      });
  }, [queryClient, t]);

  return {
    paymentUrl,
    startPayment,
    closePayment,
    isPaying: mutation.isPending,
  };
}
