import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useFaceId } from '@/hooks/use-face-id';

type StatusMessage = { type: 'success' | 'error'; text: string };

type Args = {
  username: string;
  verifyPassword?: (password: string) => Promise<boolean>;
  onStatus?: (msg: StatusMessage | null) => void;
};

export function useProfileFaceIdToggle({ username, verifyPassword, onStatus }: Args) {
  const { t } = useTranslation();
  const faceId = useFaceId();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  function reportStatus(msg: StatusMessage | null) {
    setStatusMessage(msg);
    onStatus?.(msg);
  }

  const handleToggle = useCallback(
    async (next: boolean) => {
      if (next) {
        if (!faceId.availability.isAvailable) return;
        setModalError(null);
        setModalVisible(true);
        return;
      }
      try {
        await faceId.disable();
        reportStatus({ type: 'success', text: t('faceId.disableSuccess') });
      } catch {
        reportStatus({ type: 'error', text: t('faceId.errorGeneric') });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [faceId, t],
  );

  const handleConfirmEnable = useCallback(
    async (password: string) => {
      setIsSubmitting(true);
      setModalError(null);
      try {
        if (verifyPassword) {
          const passwordOk = await verifyPassword(password);
          if (!passwordOk) {
            setModalError(t('faceId.errorInvalidCredentials'));
            return;
          }
        }
        const res = await faceId.enable({
          username,
          password,
          promptMessage: t('faceId.enablePromptMessage'),
        });
        if (res.ok) {
          setModalVisible(false);
          reportStatus({ type: 'success', text: t('faceId.enableSuccess') });
          return;
        }
        if (res.reason === 'cancelled') {
          setModalError(t('faceId.errorCancelled'));
        } else if (res.reason === 'not_enrolled') {
          setModalError(t('faceId.unavailableNotEnrolled'));
        } else if (res.reason === 'unavailable') {
          setModalError(t('faceId.unavailableHardware'));
        } else {
          setModalError(t('faceId.errorFailed'));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [faceId, username, verifyPassword, t],
  );

  return {
    faceId,
    modalVisible,
    isSubmitting,
    modalError,
    statusMessage,
    handleToggle,
    handleConfirmEnable,
    closeModal: () => setModalVisible(false),
  };
}
