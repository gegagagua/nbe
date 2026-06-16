import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  createBogPaymentIntent,
  syncBogPaymentIntentStatus,
} from '@/api/guest-fine-payment';
import { showErrorToast } from '@/lib/show-error-toast';
import type { GuestFinePaymentContext } from '@/types/guest-fine';

export function useGuestFinePayment() {
  const { t } = useTranslation();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  // Tracks the latest intent id without React render timing — needed so the
  // synchronous closePayment() can still reach the id after state is cleared.
  const intentIdRef = useRef<string | null>(null);

  const mutation = useMutation({
    mutationFn: (context: GuestFinePaymentContext) =>
      createBogPaymentIntent({
        ...context,
        paymentMethod: 'CARD',
      }),
    onSuccess: (result) => {
      setPaymentUrl(result.paymentUrl);
      setPaymentIntentId(result.paymentIntentId);
      intentIdRef.current = result.paymentIntentId;
    },
    onError: (error) => showErrorToast(t('cases.guestFine.payError'), error),
  });

  // Any close (manual X or auto-detected success/error redirect) clears the
  // modal and pings sync-status so the backend can persist the final outcome.
  const closePayment = useCallback(() => {
    const id = intentIdRef.current;
    setPaymentUrl(null);
    setPaymentIntentId(null);
    intentIdRef.current = null;
    if (id == null) return;
    syncBogPaymentIntentStatus(id).catch((error) => {
      showErrorToast(t('cases.guestFine.payError'), error);
    });
  }, [t]);

  const openPaymentUrl = useCallback((url: string) => setPaymentUrl(url), []);

  return {
    paymentUrl,
    paymentIntentId,
    closePayment,
    openPaymentUrl,
    startPayment: mutation.mutate,
    isPaying: mutation.isPending,
  };
}
