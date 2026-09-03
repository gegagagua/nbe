import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { createSession, verifyLoginOtp } from "@/api/sessions";
import { changePassword } from "@/api/users";
import { getBiometricAvailability } from "@/lib/biometric-auth";
import { resolveDeviceName } from "@/lib/device-info";
import { setGuestMode } from "@/lib/guest-mode";
import { getPasskeyCredentialId } from "@/lib/passkey-storage";
import {
    isPasskeySupported,
    registerDevicePasskey,
} from "@/lib/passkey-service";
import { mapChangePasswordError } from "@/lib/map-change-password-error";
import { resetStackTo } from "@/lib/reset-navigation";
import { mapLoginError } from "@/lib/map-login-error";
import {
    isSimilarPasswordUsed,
    recordPasswordChange,
} from "@/lib/password-history-storage";
import {
    clearSessionToken,
    setSessionToken,
} from "@/lib/session-token-storage";
import { setSessionUserProfile } from "@/lib/session-user-profile-storage";
import { showErrorToast } from "@/lib/show-error-toast";
import { showSuccessToast } from "@/lib/show-success-toast";
import { syncFaceIdCredentialsIfEnabled } from "@/lib/sync-face-id-credentials";
import { createLoginFormSchema } from "@/schemas/login-form.schema";
import type { LoginFormState } from "@/types/login";
import type { LoginFormValues } from "@/types/login-form-values";

export function useLoginForm(): LoginFormState {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createLoginFormSchema(t), [t, i18n.language]);
  const [pendingPwdChange, setPendingPwdChange] = useState<{
    username: string;
    otpPwd: string;
  } | null>(null);
  const [isForcingPwdChange, setIsForcingPwdChange] = useState(false);
  const [pendingOtp, setPendingOtp] = useState<{
    token: string;
    credentials: LoginFormValues;
  } | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [pendingDeviceTrust, setPendingDeviceTrust] = useState(false);
  const [isTrustingDevice, setIsTrustingDevice] = useState(false);

  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { username: "", password: "" },
  });

  // Shared session persistence for both password and passkey logins. `username`
  // is stored as-is so Face ID (which re-runs createSession with it) stays valid;
  // `syncFaceId` is only passed when we actually hold a plaintext password.
  // Navigation is intentionally NOT done here — callers navigate once they've
  // decided whether to first show the post-login "trust this device" prompt.
  const persistSession = useCallback(
    async (
      session: import("@/types/session").CreateSessionResponse,
      opts: {
        username: string;
        syncFaceId?: { username: string; password: string };
      },
    ) => {
      const { token, user, lastSession } = session;
      await setSessionToken(token);
      if (user) {
        await setSessionUserProfile({
          id: user.id,
          username: opts.username || user.username || user.idnumber || "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          lastSession: lastSession ?? null,
          // pwdChngDate arrives nested on `user`.
          pwdChngDate: user.pwdChngDate ?? null,
        });
      }
      setGuestMode(false);
      if (opts.syncFaceId) {
        await syncFaceIdCredentialsIfEnabled(opts.syncFaceId);
      }
    },
    [],
  );

  // Whether to offer trusting this device after a password/OTP login: only when
  // passkeys are usable here, biometrics are enrolled (device trust is a
  // biometric login — never offer it without Face ID / fingerprint), and the
  // device isn't already trusted. A passkey sign-in skips this — already trusted.
  const shouldPromptDeviceTrust = useCallback(async () => {
    if (!isPasskeySupported()) return false;
    const availability = await getBiometricAvailability();
    if (!availability.isAvailable) return false;
    const credentialId = await getPasskeyCredentialId();
    return !credentialId;
  }, []);

  const finishLogin = useCallback(
    async (
      session: import("@/types/session").CreateSessionResponse,
      credentials: LoginFormValues,
    ) => {
      await persistSession(session, {
        username: credentials.username.trim(),
        syncFaceId: {
          username: credentials.username,
          password: credentials.password,
        },
      });
      // The session token is now set, which is what authorises the passkey
      // registration below. Prompt if untrusted; otherwise go straight in.
      if (await shouldPromptDeviceTrust()) {
        setPendingDeviceTrust(true);
        return;
      }
      resetStackTo("/dashboard");
    },
    [persistSession, shouldPromptDeviceTrust],
  );

  // Passkey login already returns a SESSION token (biometric = strong auth); the
  // caller in the login screen handles cancellation/failure reasons and toasts.
  const completePasskeyLogin = useCallback(
    async (session: import("@/types/session").CreateSessionResponse) => {
      await persistSession(session, {
        username: session.user?.username || session.user?.idnumber || "",
      });
      resetStackTo("/dashboard");
    },
    [persistSession],
  );

  // Confirm handler for the post-login trust prompt: mint the passkey, then
  // continue into the app regardless of the outcome (the user is already signed
  // in — trusting the device is optional). The modal is closed before the OS
  // passkey sheet appears; on iOS a visible RN Modal can make it fail.
  const handleDeviceTrustConfirm = useCallback(
    async (label: string) => {
      setPendingDeviceTrust(false);
      setIsTrustingDevice(true);
      try {
        const result = await registerDevicePasskey(label);
        if (result.ok) {
          showSuccessToast(t("deviceTrust.enableSuccess"));
        } else if (result.reason === "unsupported") {
          showErrorToast(t("deviceTrust.unavailable"));
        } else if (result.reason !== "cancelled") {
          showErrorToast(t("deviceTrust.errorFailed"), result.error);
        }
      } finally {
        setIsTrustingDevice(false);
        resetStackTo("/dashboard");
      }
    },
    [t],
  );

  const handleDeviceTrustSkip = useCallback(() => {
    setPendingDeviceTrust(false);
    resetStackTo("/dashboard");
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginFormValues) =>
      createSession({
        username: payload.username,
        password: payload.password,
      }),
    onSuccess: async (data, variables) => {
      if (data.tokenType === "OTP") {
        setPendingOtp({ token: data.token, credentials: variables });
        return;
      }
      if (data.tokenType === "PWD_CHNG") {
        await setSessionToken(data.token);
        setPendingPwdChange({
          username: variables.username,
          otpPwd: variables.password,
        });
        return;
      }
      await finishLogin(data, variables);
    },
    onError: (err) => {
      showErrorToast(mapLoginError(err), err);
    },
  });

  const handleForcedPasswordChange = useCallback(
    async (newPwd: string) => {
      if (!pendingPwdChange) return;
      setIsForcingPwdChange(true);
      try {
        if (await isSimilarPasswordUsed(newPwd)) {
          showErrorToast(t("validation.similarPasswordUsed"));
          return;
        }
        await changePassword({
          crntPwd: pendingPwdChange.otpPwd,
          newPwd,
          retypeNewPwd: newPwd,
        });
        await recordPasswordChange(newPwd);
        // Changing the password invalidates the temporary-password session, so
        // don't try to load the profile or auto-login. Drop the stale token,
        // close the modal, and let the user sign in with their new password.
        await clearSessionToken();
        setPendingPwdChange(null);
        showSuccessToast(t("login.forcedPwdChangeSuccess"));
      } catch (err) {
        showErrorToast(mapChangePasswordError(err), err);
      } finally {
        setIsForcingPwdChange(false);
      }
    },
    [pendingPwdChange, t],
  );

  const handleOtpVerify = useCallback(
    async (code: string) => {
      if (!pendingOtp) return;
      setIsVerifyingOtp(true);
      try {
        const session = await verifyLoginOtp(pendingOtp.token, code);
        setPendingOtp(null);
        await finishLogin(session, pendingOtp.credentials);
      } catch (err) {
        showErrorToast(mapLoginError(err), err);
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    [pendingOtp, finishLogin],
  );

  const { mutate, mutateAsync, isPending } = loginMutation;

  const onSubmit = useMemo(
    () =>
      handleSubmit((values) => {
        mutate(values);
      }),
    [handleSubmit, mutate],
  );

  const submitDisabled = isPending || !formState.isValid;

  const submitWithCredentials = useCallback(
    async (
      values: LoginFormValues,
    ): Promise<{ ok: true } | { ok: false; error: unknown }> => {
      try {
        await mutateAsync(values);
        return { ok: true };
      } catch (error) {
        return { ok: false, error };
      }
    },
    [mutateAsync],
  );

  return {
    control,
    errors: formState.errors,
    onSubmit,
    submitDisabled,
    submitWithCredentials,
    completePasskeyLogin,
    forcedPwdChange: {
      visible: pendingPwdChange !== null,
      isSubmitting: isForcingPwdChange,
      onSubmit: handleForcedPasswordChange,
    },
    otpLogin: {
      visible: pendingOtp !== null,
      isSubmitting: isVerifyingOtp,
      onSubmit: handleOtpVerify,
      onCancel: () => setPendingOtp(null),
    },
    deviceTrustPrompt: {
      visible: pendingDeviceTrust,
      isSubmitting: isTrustingDevice,
      defaultLabel: resolveDeviceName(),
      onConfirm: handleDeviceTrustConfirm,
      onSkip: handleDeviceTrustSkip,
    },
  };
}
