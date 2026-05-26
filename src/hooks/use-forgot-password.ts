import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { resetPassword, sendOtp, verifyOtp } from '@/api/password-reset';
import { clearFaceIdAll } from '@/lib/face-id-storage';
import { isSimilarPasswordUsed, recordPasswordChange } from '@/lib/password-history-storage';
import { showErrorToast } from '@/lib/show-error-toast';

type Step = 'phone' | 'otp' | 'newPassword';
type StatusMessage = { type: 'success' | 'error'; text: string };

export function useForgotPassword() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [verifiedCode, setVerifiedCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const sendOtpMutation = useMutation({
    mutationFn: (p: string) => sendOtp(p),
    onSuccess: () => {
      setStep('otp');
    },
    onError: () => {
      showErrorToast(t('forgotPassword.networkError'));
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ p, code }: { p: string; code: string }) => verifyOtp(p, code),
    onSuccess: (_data, variables) => {
      setVerifiedCode(variables.code);
      setStep('newPassword');
    },
    onError: () => {
      showErrorToast(t('validation.otpMismatch'));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (newPassword: string) => resetPassword(phone, verifiedCode, newPassword),
    onSuccess: async (_data, newPassword) => {
      await recordPasswordChange(newPassword);
      // password changed → previously stored Face ID credentials are no longer valid
      await clearFaceIdAll();
      setStatusMessage({ type: 'success', text: t('forgotPassword.successMessage') });
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    },
    onError: () => {
      setStatusMessage({ type: 'error', text: t('forgotPassword.errorMessage') });
    },
  });

  const handlePhoneSubmit = useCallback(
    (p: string) => {
      setPhone(p);
      sendOtpMutation.mutate(p);
    },
    [sendOtpMutation],
  );

  const handleOtpVerify = useCallback(
    (code: string) => {
      verifyOtpMutation.mutate({ p: phone, code });
    },
    [phone, verifyOtpMutation],
  );

  const handleResendOtp = useCallback(() => {
    sendOtpMutation.mutate(phone);
  }, [phone, sendOtpMutation]);

  const handleNewPasswordSubmit = useCallback(
    async (newPassword: string) => {
      const alreadyUsed = await isSimilarPasswordUsed(newPassword);
      if (alreadyUsed) {
        setStatusMessage({ type: 'error', text: t('validation.similarPasswordUsed') });
        return;
      }
      setStatusMessage(null);
      resetPasswordMutation.mutate(newPassword);
    },
    [resetPasswordMutation, t],
  );

  return {
    step,
    statusMessage,
    handlePhoneSubmit,
    handleOtpVerify,
    handleResendOtp,
    handleNewPasswordSubmit,
    isSendingOtp: sendOtpMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
  };
}
