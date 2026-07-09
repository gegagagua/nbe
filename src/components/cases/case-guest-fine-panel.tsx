import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGuestFineCheck } from '@/hooks/use-guest-fine-check';
import {
  createGuestFineCheckSchema,
  type GuestFineCheckFormValues,
} from '@/schemas/guest-fine-check.schema';
import type { GuestPersonType } from '@/types/guest-fine';

import { caseGuestFinePanelStyles as s } from './case-guest-fine-panel.styles';
import { CaseGuestFineResult } from './case-guest-fine-result';
import { CaseGuestPersonTabs } from './case-guest-person-tabs';

export function CaseGuestFinePanel() {
  const { t, i18n } = useTranslation();
  const { result, handleCheck, clearResult, isChecking } = useGuestFineCheck();
  const schema = useMemo(() => createGuestFineCheckSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState, watch, setValue, resetField } =
    useForm<GuestFineCheckFormValues>({
      resolver: zodResolver(schema),
      mode: 'onChange',
      defaultValues: {
        personType: 'physical',
        idNumber: '',
        documentNumber: '',
      },
    });

  const personType = watch('personType');

  useEffect(() => {
    clearResult();
    resetField('idNumber');
  }, [personType, clearResult, resetField]);

  const idLabel =
    personType === 'physical'
      ? t('cases.personalIdNumberLabel')
      : t('cases.legalIdentificationCodeLabel');

  const onSubmit = handleSubmit((values) => handleCheck(values));

  return (
    <View style={s.card}>
      <Text style={s.hint}>{t('cases.guestFine.categoryHint')}</Text>
      <CaseGuestPersonTabs
        value={personType}
        onChange={(next: GuestPersonType) => setValue('personType', next)}
      />
      <View style={s.fieldRow}>
        <Text style={s.label}>{idLabel}</Text>
        <Controller
          control={control}
          name="idNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={idLabel}
              keyboardType={personType === 'physical' ? 'number-pad' : 'default'}
              errorMessage={formState.errors.idNumber?.message}
            />
          )}
        />
      </View>
      <View style={s.fieldRow}>
        <Text style={s.label}>{t('cases.guestFine.documentNumberLabel')}</Text>
        <Controller
          control={control}
          name="documentNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('cases.guestFine.documentNumberPlaceholder')}
              errorMessage={formState.errors.documentNumber?.message}
            />
          )}
        />
      </View>
      <Button
        label={t('cases.guestFine.checkButton')}
        onPress={() => onSubmit()}
        disabled={isChecking || !formState.isValid}
      />
      {result && !isChecking ? (
        <CaseGuestFineResult result={result} onPaymentSynced={clearResult} />
      ) : null}
    </View>
  );
}
