import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createBogPaymentIntent } from '@/api/guest-fine-payment';
import { showErrorToast } from '@/lib/show-error-toast';
import type { GuestFinePaymentContext } from '@/types/guest-fine';

export function useGuestFinePayment() {
  const { t } = useTranslation();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (context: GuestFinePaymentContext) =>
      createBogPaymentIntent({
        ...context,
        paymentMethod: 'CARD',
      }),
    onSuccess: (result) => setPaymentUrl(result.paymentUrl),
    onError: (error) => showErrorToast(t('cases.guestFine.payError'), error),
  });

  const closePayment = useCallback(() => setPaymentUrl(null), []);

  const openPaymentUrl = useCallback((url: string) => setPaymentUrl(url), []);

  return {
    paymentUrl,
    closePayment,
    openPaymentUrl,
    startPayment: mutation.mutate,
    isPaying: mutation.isPending,
  };
}
