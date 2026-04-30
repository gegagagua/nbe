import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { createRegisterPhysicalSchema } from '@/schemas/register-physical.schema';
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
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createRegisterPhysicalSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState } = useForm<RegisterPhysicalValues>({
    resolver: zodResolver(schema),
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
