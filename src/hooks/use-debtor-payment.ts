import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { getDebtorApp, getDebtorAppPayments } from '@/api/debtor-apps';
import {
  createBogPaymentIntent,
  syncBogPaymentIntentStatus,
} from '@/api/guest-fine-payment';
import { ToastLayout } from '@/constants/toast';
import { showErrorToast } from '@/lib/show-error-toast';

const SETTLE_ATTEMPTS = 12;
const SETTLE_DELAY_MS = 2000;

type DebtorPaymentBaseline = {
  paymentCount: number;
  regnumber: string | null;
};

async function loadBaseline(appId: number): Promise<DebtorPaymentBaseline> {
  const [payments, app] = await Promise.all([
    getDebtorAppPayments(appId),
    getDebtorApp(appId),
  ]);
  return { paymentCount: payments.length, regnumber: app.regnumber ?? null };
}

async function isPaymentConfirmed(
  appId: number,
  baseline: DebtorPaymentBaseline,
): Promise<boolean> {
  const current = await loadBaseline(appId);
  if (current.paymentCount > baseline.paymentCount) return true;
  return baseline.regnumber == null && current.regnumber != null;
}

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
  const baselineRef = useRef<DebtorPaymentBaseline | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ appId, personId, amount }: DebtorPaymentInput) => {
      const baseline = await loadBaseline(appId);
      const intent = await createBogPaymentIntent({
        destType: 'DEBTOR',
        appId,
        personId,
        amount,
        paymentMethod: 'CARD',
      });
      return { intent, baseline };
    },
    onSuccess: ({ intent, baseline }) => {
      baselineRef.current = baseline;
      setPaymentUrl(intent.paymentUrl);
      intentIdRef.current = intent.paymentIntentId;
    },
    onError: (error) => showErrorToast(t('debtors.payError'), error),
  });

  const startPayment = useCallback(
    (input: DebtorPaymentInput) => {
      appIdRef.current = input.appId;
      baselineRef.current = null;
      setIsPaid(false);
      mutation.mutate(input);
    },
    [mutation],
  );

  // Any close (manual or an auto-detected BOG redirect) pings sync-status so the
  // backend persists the outcome, then reloads the screens showing it.
  const closePayment = useCallback(() => {
    const intentId = intentIdRef.current;
    const appId = appIdRef.current;
    const baseline = baselineRef.current;
    setPaymentUrl(null);
    intentIdRef.current = null;
    if (intentId == null || appId == null || baseline == null) return;

    setIsSettling(true);
    void (async () => {
      try {
        let confirmed = false;
        for (let attempt = 0; attempt < SETTLE_ATTEMPTS; attempt += 1) {
          await syncBogPaymentIntentStatus(intentId);
          if (await isPaymentConfirmed(appId, baseline)) {
            confirmed = true;
            break;
          }
          if (attempt < SETTLE_ATTEMPTS - 1) {
            await new Promise((resolve) => setTimeout(resolve, SETTLE_DELAY_MS));
          }
        }
        if (confirmed) {
          setIsPaid(true);
          Toast.show({
            type: 'success',
            text1: t('debtors.paySuccess'),
            visibilityTime: ToastLayout.visibilityMs,
            position: 'top',
          });
        } else {
          Toast.show({
            type: 'info',
            text1: t('debtors.payPending'),
            visibilityTime: ToastLayout.visibilityMs,
            position: 'top',
          });
        }
      } catch (error) {
        showErrorToast(t('debtors.payError'), error);
      } finally {
        setIsSettling(false);
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
    isSettling,
    isPaid,
  };
}
