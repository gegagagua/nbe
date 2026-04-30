import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { registerPhysicalSchema } from '@/schemas/register-physical.schema';
import type { RegisterPhysicalValues } from '@/types/register-form-values';

const defaultValues: RegisterPhysicalValues = {
  firstName: '',
  lastName: '',
  personalId: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export function useRegisterPhysicalForm() {
  const { control, handleSubmit, formState } = useForm<RegisterPhysicalValues>({
    resolver: zodResolver(registerPhysicalSchema),
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
