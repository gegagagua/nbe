import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { createSession } from "@/api/sessions";
import { setGuestMode } from "@/lib/guest-mode";
import { mapLoginError } from "@/lib/map-login-error";
import { setSessionToken } from "@/lib/session-token-storage";
import { setSessionUserProfile } from "@/lib/session-user-profile-storage";
import { showErrorToast } from "@/lib/show-error-toast";
import { syncFaceIdCredentialsIfEnabled } from "@/lib/sync-face-id-credentials";
import { createLoginFormSchema } from "@/schemas/login-form.schema";
import type { LoginFormState } from "@/types/login";
import type { LoginFormValues } from "@/types/login-form-values";

export function useLoginForm(): LoginFormState {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createLoginFormSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { username: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginFormValues) =>
      createSession({
        username: payload.username,
        password: payload.password,
      }),
    onSuccess: async (data, variables) => {
      console.log("data", data?.token);
      await setSessionToken(data.token);
      await setSessionUserProfile({
        id: data.user.id,
        username: data.user.username ?? data.user.idnumber ?? "",
        firstName: data.user.firstName ?? "",
        lastName: data.user.lastName ?? "",
      });
      setGuestMode(false);
      await syncFaceIdCredentialsIfEnabled({
        username: variables.username,
        password: variables.password,
      });
      router.replace("/dashboard");
    },
    onError: (err) => {
      showErrorToast(mapLoginError(err), err);
    },
  });

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
  };
}
