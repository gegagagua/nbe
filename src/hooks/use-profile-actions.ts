import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  changePassword,
  confirmUserPhone,
  updateUserMe,
  updateUserPhone,
} from '@/api/users';
import { buildUpdateUserPayload } from '@/lib/build-update-user-payload';
import { clearFaceIdAll } from '@/lib/face-id-storage';
import { mapChangePasswordError } from '@/lib/map-change-password-error';
import { mapUpdateUserError } from '@/lib/map-update-user-error';
import { isSimilarPasswordUsed, recordPasswordChange } from '@/lib/password-history-storage';
import { normalizeGeorgianPhone } from '@/lib/phone';
import { resolveUserPhone } from '@/lib/resolve-user-contacts';
import { showErrorToast } from '@/lib/show-error-toast';
import type { ProfileInfoEditValues } from '@/schemas/profile-info-edit.schema';
import type { SessionUserProfileBrief } from '@/types/session';
import type { UserDetail } from '@/types/users';

type StatusMessage = { type: 'success' | 'error'; text: string };

type UseProfileActionsArgs = {
  profile: SessionUserProfileBrief | null;
  detail: UserDetail | null;
  onDetailRefetch?: () => Promise<void>;
};

export function useProfileActions({ profile, detail, onDetailRefetch }: UseProfileActionsArgs) {
  const { t } = useTranslation();
  const [infoStatus, setInfoStatus] = useState<StatusMessage | null>(null);
  const [pwStatus, setPwStatus] = useState<StatusMessage | null>(null);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);
  // The new phone awaiting OTP confirmation, or null when no change is pending.
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);

  const handleSaveInfo = useCallback(
    async (values: ProfileInfoEditValues) => {
      if (!profile) {
        setInfoStatus({ type: 'error', text: t('profile.saveMissingSession') });
        return;
      }
      if (!detail) {
        setInfoStatus({ type: 'error', text: t('profile.saveError') });
        return;
      }
      setIsSavingInfo(true);
      setInfoStatus(null);
      try {
        await updateUserMe(buildUpdateUserPayload(detail, values));

        // Phone isn't persisted by the generic /users PUT — it goes through its
        // own endpoint and, when changed, requires OTP confirmation. Request the
        // code now and surface the OTP prompt; the change is committed once the
        // code is verified below.
        const nextPhone = values.phone.trim();
        const normalizedNext = nextPhone ? normalizeGeorgianPhone(nextPhone) : '';
        const currentPhone = resolveUserPhone(detail.contacts);
        const normalizedCurrent = currentPhone
          ? normalizeGeorgianPhone(currentPhone)
          : '';
        if (normalizedNext && normalizedNext !== normalizedCurrent) {
          await updateUserPhone(normalizedNext);
          // Reflect the already-saved fields (email/addresses) while the phone
          // change waits for OTP confirmation.
          await onDetailRefetch?.();
          setPendingPhone(normalizedNext);
          setInfoStatus({ type: 'success', text: t('profile.phoneOtpSent') });
          return;
        }

        await onDetailRefetch?.();
        setInfoStatus({ type: 'success', text: t('profile.saveSuccess') });
      } catch (err) {
        setInfoStatus({ type: 'error', text: mapUpdateUserError(err) });
      } finally {
        setIsSavingInfo(false);
      }
    },
    [detail, onDetailRefetch, profile, t],
  );

  const handleVerifyPhoneOtp = useCallback(
    async (code: string) => {
      if (!profile || !pendingPhone) return;
      setIsVerifyingPhone(true);
      try {
        await confirmUserPhone(profile.id, code);
        setPendingPhone(null);
        await onDetailRefetch?.();
        setInfoStatus({ type: 'success', text: t('profile.saveSuccess') });
      } catch (err) {
        showErrorToast(t('profile.phoneOtpError'), err);
      } finally {
        setIsVerifyingPhone(false);
      }
    },
    [profile, pendingPhone, onDetailRefetch, t],
  );

  const handleChangePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!profile) {
        setPwStatus({ type: 'error', text: t('profile.changePasswordMissingSession') });
        return;
      }
      setIsChangingPw(true);
      setPwStatus(null);
      try {
        const alreadyUsed = await isSimilarPasswordUsed(newPassword);
        if (alreadyUsed) {
          setPwStatus({ type: 'error', text: t('validation.similarPasswordUsed') });
          return;
        }
        await changePassword({
          crntPwd: currentPassword,
          newPwd: newPassword,
          retypeNewPwd: newPassword,
        });
        await recordPasswordChange(newPassword);
        await clearFaceIdAll();
        setPwStatus({ type: 'success', text: t('profile.changePasswordSuccess') });
      } catch (err) {
        setPwStatus({ type: 'error', text: mapChangePasswordError(err) });
      } finally {
        setIsChangingPw(false);
      }
    },
    [profile, t],
  );

  return {
    infoStatus,
    pwStatus,
    isSavingInfo,
    isChangingPw,
    handleSaveInfo,
    handleChangePassword,
    phoneOtp: {
      visible: pendingPhone !== null,
      isSubmitting: isVerifyingPhone,
      onSubmit: handleVerifyPhoneOtp,
      onCancel: () => setPendingPhone(null),
    },
  };
}
