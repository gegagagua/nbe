import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { createSession } from '@/api/sessions';
import { mapLoginError } from '@/lib/map-login-error';
import { setSessionToken } from '@/lib/session-token-storage';
import { setSessionUserProfile } from '@/lib/session-user-profile-storage';
import { showErrorToast } from '@/lib/show-error-toast';
import { loginFormSchema } from '@/schemas/login-form.schema';
import type { LoginFormState } from '@/types/login';
import type { LoginFormValues } from '@/types/login-form-values';

export function useLoginForm(): LoginFormState {
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
    defaultValues: { username: 'Irma_Sikharulidze2', password: 'Sixaruli2222' },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginFormValues) =>
      createSession({
        username: payload.username,
        password: payload.password,
      }),
    onSuccess: async (data) => {
      await setSessionToken(data.token);
      await setSessionUserProfile({
        firstName: data.user.firstName ?? '',
        lastName: data.user.lastName ?? '',
      });
      router.replace('/dashboard');
    },
    onError: (err) => {
      showErrorToast(mapLoginError(err), err);
    },
  });

  const { mutate, isPending } = loginMutation;

  const onSubmit = useMemo(
    () =>
      handleSubmit((values) => {
        mutate(values);
      }),
    [handleSubmit, mutate],
  );

  const submitDisabled = isPending || !formState.isValid;

  return {
    control,
    errors: formState.errors,
    onSubmit,
    submitDisabled,
  };
}
