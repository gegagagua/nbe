import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import { DebtorExtractMockSubject, debtorExtractMockApplicationNumber } from '@/constants/debtor-extract-mock';
import { useDebtorExtractApplicant } from '@/hooks/use-debtor-extract-applicant';
import type { DebtorExtractFlowPhase, DebtorExtractPaymentMethod } from '@/types/debtor-extract';
import { defaultDebtorExtractPaymentMethod } from '@/utils/debtor-extract-payment-options';

import { DebtorExtractPhaseForm } from './debtor-extract-phase-form';
import { DebtorExtractPhasePayment } from './debtor-extract-phase-payment';
import { DebtorExtractPhaseSubmit } from './debtor-extract-phase-submit';
import { debtorExtractRequestStyles as s } from './debtor-extract-request.styles';
import { DebtorExtractSubheader } from './debtor-extract-subheader';

export function DebtorExtractRequestScreen() {
  const { t } = useTranslation();
  const applicant = useDebtorExtractApplicant();
  const [phase, setPhase] = useState<DebtorExtractFlowPhase>('form');
  const [subjectId, setSubjectId] = useState<string>(DebtorExtractMockSubject.personalId);
  const [subjectName, setSubjectName] = useState<string>(DebtorExtractMockSubject.fullName);
  const [method, setMethod] = useState<DebtorExtractPaymentMethod>(defaultDebtorExtractPaymentMethod);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);

  const handleBack = () => {
    if (phase === 'form') {
      router.back();
      return;
    }
    if (phase === 'payment') {
      setPhase('form');
      return;
    }
    router.back();
  };

  const handlePay = () => {
    setApplicationNumber(debtorExtractMockApplicationNumber());
    setPhase('submit');
  };

  return (
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <DebtorExtractSubheader
          title={t('debtors.extractFlowTitle')}
          backA11y={t('debtors.extractBackA11y')}
          onBack={handleBack}
        />
        <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          {phase === 'form' ? (
            <DebtorExtractPhaseForm
              applicantPersonalId={applicant.personalId}
              applicantFullName={applicant.fullName}
              subjectPersonalId={subjectId}
              onSubjectPersonalId={setSubjectId}
              subjectFullName={subjectName}
              onSubjectFullName={setSubjectName}
              onContinue={() => setPhase('payment')}
            />
          ) : null}
          {phase === 'payment' ? (
            <DebtorExtractPhasePayment selected={method} onSelect={setMethod} onPay={handlePay} />
          ) : null}
          {phase === 'submit' && applicationNumber ? (
            <DebtorExtractPhaseSubmit
              applicationNumber={applicationNumber}
              paymentMethod={method}
              onSent={() => router.back()}
            />
          ) : null}
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
