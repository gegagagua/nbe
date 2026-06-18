import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { createSession, verifyLoginOtp } from "@/api/sessions";
import { changePassword } from "@/api/users";
import { setGuestMode } from "@/lib/guest-mode";
import { mapChangePasswordError } from "@/lib/map-change-password-error";
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

  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { username: "", password: "" },
  });

  const finishLogin = useCallback(
    async (
      session: import("@/types/session").CreateSessionResponse,
      credentials: LoginFormValues,
    ) => {
      const { token, user, lastSession } = session;
      await setSessionToken(token);
      if (user) {
        await setSessionUserProfile({
          id: user.id,
          // Store the exact identifier the user logged in with so Face ID
          // (which re-runs createSession with this username) stays valid.
          username:
            credentials.username.trim() || user.username || user.idnumber || "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          lastSession: lastSession ?? null,
          // pwdChngDate arrives nested on `user`.
          pwdChngDate: user.pwdChngDate ?? null,
        });
      }
      setGuestMode(false);
      await syncFaceIdCredentialsIfEnabled({
        username: credentials.username,
        password: credentials.password,
      });
      router.replace("/dashboard");
    },
    [],
  );

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
    async (values: LoginFormValues): Promise<{ ok: boolean }> => {
      try {
        await mutateAsync(values);
        return { ok: true };
      } catch {
        return { ok: false };
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
  };
}
