import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { createRegisterPhysicalSchema } from '@/schemas/register-physical.schema';
import type { RegisterPhysicalValues } from '@/types/register-form-values';

const defaultValues: RegisterPhysicalValues = {
  personalId: '01008057849',
  actualAddress: 'Mindeli',
  phone: '597887736',
  password: 'NiNuca199@',
  confirmPassword: 'NiNuca199@',
  legalAddress: '',
  email: 'gegagagua@gmail.com',
};

export function useRegisterPhysicalForm(onValidSubmit: (values: RegisterPhysicalValues) => void) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createRegisterPhysicalSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState } = useForm<RegisterPhysicalValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const onSubmit = handleSubmit((values) => onValidSubmit(values));

  return {
    control,
    onSubmit,
    submitDisabled: !formState.isValid,
  };
}
