import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { requestPasswordReset } from '@/api/password-reset';
import { showErrorToast } from '@/lib/show-error-toast';

type StatusMessage = { type: 'success' | 'error'; text: string };

export function useForgotPassword() {
  const { t } = useTranslation();
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const resetMutation = useMutation({
    mutationFn: (username: string) => requestPasswordReset(username),
    onSuccess: () => {
      setStatusMessage({ type: 'success', text: t('forgotPassword.successMessage') });
    },
    onError: () => {
      setStatusMessage({ type: 'error', text: t('forgotPassword.genericError') });
      showErrorToast(t('forgotPassword.genericError'));
    },
  });

  const handleSubmit = useCallback(
    (username: string) => {
      setStatusMessage(null);
      resetMutation.mutate(username);
    },
    [resetMutation],
  );

  return {
    statusMessage,
    handleSubmit,
    isSubmitting: resetMutation.isPending,
  };
}
