import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { registerLegalSchema } from '@/schemas/register-legal.schema';
import type { RegisterLegalValues } from '@/types/register-form-values';

const defaultValues: RegisterLegalValues = {
  companyName: '',
  identificationCode: '',
  representativeName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export function useRegisterLegalForm() {
  const { control, handleSubmit, formState } = useForm<RegisterLegalValues>({
    resolver: zodResolver(registerLegalSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });
  const onSubmit = handleSubmit(() => undefined);
  return {
    control,
    onSubmit,
    submitDisabled: !formState.isValid,
  };
}
