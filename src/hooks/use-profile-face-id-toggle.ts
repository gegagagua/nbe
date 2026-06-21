import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { verifyLoginOtp } from '@/api/sessions';
import { useFaceId } from '@/hooks/use-face-id';
import { showErrorToast } from '@/lib/show-error-toast';
import type { CreateSessionResponse } from '@/types/session';

type StatusMessage = { type: 'success' | 'error'; text: string };

type VerifyPassword = (password: string) => Promise<CreateSessionResponse | null>;

type Args = {
  username: string;
  verifyPassword?: VerifyPassword;
  onStatus?: (msg: StatusMessage | null) => void;
};

export function useProfileFaceIdToggle({ username, verifyPassword, onStatus }: Args) {
  const { t } = useTranslation();
  const faceId = useFaceId();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  // When the account requires a one-time code, the password step hands off to
  // an OTP step; Face ID is only persisted once that code is verified.
  const [pendingOtp, setPendingOtp] = useState<{ token: string; password: string } | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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

  // Runs the biometric prompt and persists the credentials. Returns a
  // translated error message on failure, or `null` on success.
  const runEnable = useCallback(
    async (password: string): Promise<string | null> => {
      const res = await faceId.enable({
        username,
        password,
        promptMessage: t('faceId.enablePromptMessage'),
      });
      if (res.ok) {
        setModalVisible(false);
        setPendingOtp(null);
        reportStatus({ type: 'success', text: t('faceId.enableSuccess') });
        return null;
      }
      if (res.reason === 'cancelled') return t('faceId.errorCancelled');
      if (res.reason === 'not_enrolled') return t('faceId.unavailableNotEnrolled');
      if (res.reason === 'unavailable') return t('faceId.unavailableHardware');
      return t('faceId.errorFailed');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [faceId, username, t],
  );

  const handleConfirmEnable = useCallback(
    async (password: string) => {
      setIsSubmitting(true);
      setModalError(null);
      try {
        if (verifyPassword) {
          const session = await verifyPassword(password);
          if (!session) {
            setModalError(t('faceId.errorInvalidCredentials'));
            return;
          }
          // The account demands a one-time code: defer enabling Face ID until
          // the OTP is verified. Swap the password modal for the OTP modal.
          if (session.tokenType === 'OTP') {
            setPendingOtp({ token: session.token, password });
            setModalVisible(false);
            return;
          }
        }
        const error = await runEnable(password);
        if (error) setModalError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [verifyPassword, runEnable, t],
  );

  const handleVerifyOtp = useCallback(
    async (code: string) => {
      if (!pendingOtp) return;
      const { token, password } = pendingOtp;
      setIsVerifyingOtp(true);
      try {
        await verifyLoginOtp(token, code);
        // Close the OTP modal before triggering the biometric system prompt so
        // the two don't compete (on iOS a visible JS modal can make the Face ID
        // prompt fail/cancel). runEnable persists the credentials afterwards.
        setPendingOtp(null);
        const error = await runEnable(password);
        if (error) showErrorToast(error);
      } catch (err) {
        showErrorToast(t('faceId.errorOtpInvalid'), err);
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    [pendingOtp, runEnable, t],
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
    otp: {
      visible: pendingOtp !== null,
      isSubmitting: isVerifyingOtp,
      onSubmit: handleVerifyOtp,
      onCancel: () => setPendingOtp(null),
    },
  };
}
