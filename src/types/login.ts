import type { ReactNode } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';

import type { LoginFormValues } from '@/types/login-form-values';

export type LoginScreenLayoutProps = {
  children: ReactNode;
  title?: string;
  contentAlign?: 'center' | 'top';
};

export type LoginFormProps = {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: () => void;
  submitDisabled: boolean;
  onRegisterPress: () => void;
  onGuestPress: () => void;
  onIdentomatDemoPress: () => void;
};

export type LoginFormState = {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: () => void;
  submitDisabled: boolean;
};
