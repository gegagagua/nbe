import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useDebtorExtractApplicant } from '@/hooks/use-debtor-extract-applicant';
import { isGuestMode } from '@/lib/guest-mode';
import type { DebtorExtractFlowPhase, DebtorExtractPaymentMethod } from '@/types/debtor-extract';
import { defaultDebtorExtractPaymentMethod } from '@/utils/debtor-extract-payment-options';

import { DebtorExtractPhaseForm } from './debtor-extract-phase-form';
import { DebtorExtractPhasePayment } from './debtor-extract-phase-payment';
import { DebtorExtractPhaseSubmit } from './debtor-extract-phase-submit';
import { DebtorExtractSubheader } from './debtor-extract-subheader';

export function DebtorExtractRequestScreen() {
  const { t } = useTranslation();
  const applicant = useDebtorExtractApplicant();
  const isGuest = isGuestMode();
  const [guestApplicantPersonalId, setGuestApplicantPersonalId] = useState('');
  const [guestApplicantFullName, setGuestApplicantFullName] = useState('');
  const [phase, setPhase] = useState<DebtorExtractFlowPhase>('form');
  const [subjectId, setSubjectId] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');
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
    const now = new Date();
    const ref = `MR-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;
    setApplicationNumber(ref);
    setPhase('submit');
  };

  return (
    <View className="flex-1 bg-bg">
      <DebtorExtractSubheader
        title={t('debtors.extractRequestButton')}
        backA11y={t('debtors.extractBackA11y')}
        onBack={handleBack}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 20 }}
        keyboardShouldPersistTaps="handled"
      >
          {phase === 'form' ? (
            <DebtorExtractPhaseForm
              applicantPersonalId={isGuest ? guestApplicantPersonalId : applicant.personalId}
              applicantFullName={isGuest ? guestApplicantFullName : applicant.fullName}
              onApplicantPersonalId={isGuest ? setGuestApplicantPersonalId : undefined}
              onApplicantFullName={isGuest ? setGuestApplicantFullName : undefined}
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
    </View>
  );
}
