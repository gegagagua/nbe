import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  createBogPaymentIntent,
  syncBogPaymentIntentStatus,
} from '@/api/guest-fine-payment';
import { showErrorToast } from '@/lib/show-error-toast';

const SETTLE_ATTEMPTS = 5;
const SETTLE_DELAY_MS = 1500;
const PAID_STATUSES = ['COMPLETED', 'PAID', 'SUCCESS', 'SUCCEEDED'];

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
  // Final provider status once the intent settles; drives post-payment routing.
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

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
      setPaymentStatus(null);
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

    void (async () => {
      try {
        // The WebView closes the moment the provider redirects, while the intent
        // can still be CREATED on their side. Keep syncing until it settles so
        // the payment actually reaches the debtor record.
        for (let attempt = 0; attempt < SETTLE_ATTEMPTS; attempt += 1) {
          const status = await syncBogPaymentIntentStatus(intentId);
          if (status && status.toUpperCase() !== 'CREATED') {
            console.log('[PAY STATUS]', status.toUpperCase());
            setPaymentStatus(status.toUpperCase());
            break;
          }
          if (attempt < SETTLE_ATTEMPTS - 1) {
            await new Promise((resolve) => setTimeout(resolve, SETTLE_DELAY_MS));
          }
        }
      } catch (error) {
        showErrorToast(t('debtors.payError'), error);
      } finally {
        queryClient.invalidateQueries({ queryKey: ['debtor-payments', appId] });
        queryClient.invalidateQueries({ queryKey: ['debtor-app', appId] });
        queryClient.invalidateQueries({ queryKey: ['debtor-apps'] });
      }
    })();
  }, [queryClient, t]);

  return {
    paymentUrl,
    startPayment,
    closePayment,
    isPaying: mutation.isPending,
    paymentStatus,
    isPaid: paymentStatus != null && PAID_STATUSES.includes(paymentStatus),
  };
}
