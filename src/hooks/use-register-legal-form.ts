import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { createRegisterLegalSchema } from '@/schemas/register-legal.schema';
import type { RegisterLegalValues } from '@/types/register-form-values';

const defaultValues: RegisterLegalValues = {
  username: '',
  companyName: '',
  identificationCode: '',
  representativeName: '',
  representativePersonalId: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export function useRegisterLegalForm() {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createRegisterLegalSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState } = useForm<RegisterLegalValues>({
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
