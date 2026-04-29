import type { ReactNode } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';

import type { LoginFormValues } from '@/types/login-form-values';

export type LoginScreenLayoutProps = {
  children: ReactNode;
};

export type LoginFormProps = {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: () => void;
  submitDisabled: boolean;
  onGuestPress: () => void;
};

export type LoginPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export type LoginTextFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  errorMessage?: string;
};

export type LoginFormState = {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: () => void;
  submitDisabled: boolean;
};
