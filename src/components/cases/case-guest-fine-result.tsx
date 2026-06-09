import { useTranslation } from 'react-i18next';
import { Linking, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { showErrorToast } from '@/lib/show-error-toast';
import type { GuestFineCheckResult } from '@/types/guest-fine';

import { caseGuestFinePanelStyles as s } from './case-guest-fine-panel.styles';

type Props = {
  result: GuestFineCheckResult;
};

export function CaseGuestFineResult({ result }: Props) {
  const { t } = useTranslation();

  function handlePay() {
    if (result.paymentUrl) {
      Linking.openURL(result.paymentUrl);
      return;
    }
    showErrorToast(t('cases.detailPaySoonToast'));
  }

  if (!result.found || (!result.personName && !result.amount)) {
    return (
      <View style={s.resultCard}>
        <Text style={s.notFound}>{t('cases.guestFine.notFound')}</Text>
      </View>
    );
  }

  return (
    <View style={s.resultCard}>
      {result.personName ? (
        <>
          <Text style={s.resultLabel}>{t('cases.guestFine.personNameLabel')}</Text>
          <Text style={s.resultValue}>{result.personName}</Text>
        </>
      ) : null}
      {result.amount ? (
        <>
          <Text style={s.resultLabel}>{t('cases.guestFine.debtAmountLabel')}</Text>
          <Text style={s.resultAmount}>
            {result.amount} {result.currency ?? 'GEL'}
          </Text>
        </>
      ) : null}
      <Button label={t('cases.detailPayButton')} onPress={handlePay} />
    </View>
  );
}
