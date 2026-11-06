import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ToastLayout } from '@/constants/toast';
import { getUserMe } from '@/api/users';
import { PaymentWebViewModal } from '@/components/ui/payment-web-view-modal';
import { useCreateDebtorApp } from '@/hooks/use-create-debtor-app';
import { useDebtorApp } from '@/hooks/use-debtor-app';
import { useDebtorAppPersons } from '@/hooks/use-debtor-app-persons';
import { useDebtorPayment } from '@/hooks/use-debtor-payment';
import { useUpdateDebtorApp } from '@/hooks/use-update-debtor-app';
import { showErrorToast } from '@/lib/show-error-toast';
import { isGuestMode } from '@/lib/guest-mode';
import { useAppTheme } from '@/theme';
import type { UserDetail } from '@/types/users';
import type { DebtorExtractPaymentMethod } from '@/types/debtor-extract';
import { defaultDebtorExtractPaymentMethod } from '@/utils/debtor-extract-payment-options';

import { DebtorAppEditModal } from './debtor-app-edit-modal';
import { DebtorExtractPhasePayment } from './debtor-extract-phase-payment';
import { DebtorExtractSubheader } from './debtor-extract-subheader';

type Params = {
  id: string;
  applicantName?: string;
  applicantId?: string;
};

/** Keeps the input look throughout; omitting `onChangeText` renders it disabled
 *  — used for the applicant block and for every field once recorded. */
function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  maxLength,
  required = false,
}: {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  keyboardType?: 'number-pad' | 'phone-pad';
  maxLength?: number;
  required?: boolean;
}) {
  const { colors } = useAppTheme();
  const editable = Boolean(onChangeText);
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-0.5">
        <Text className="text-label font-semibold text-fg-secondary">{label}</Text>
        {required ? <Text className="text-label font-semibold text-danger">*</Text> : null}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholderTextColor={colors.inputPlaceholder}
        className={`min-h-[50px] rounded-md border border-input-border px-4 py-2 text-body ${
          editable ? 'bg-input text-fg' : 'bg-surface-sunken text-fg-secondary'
        }`}
        style={{ color: editable ? colors.inputText : colors.textSecondary }}
      />
    </View>
  );
}

export function DebtorAppExtractRequestScreen() {
  const { t } = useTranslation();
  const { id, applicantName, applicantId } = useLocalSearchParams<Params>();
  const appId = Number(id);
  const cameFromCase = Number.isFinite(appId);

  // Set once recorded — locks the form and switches editing over to PUT.
  const [createdAppId, setCreatedAppId] = useState<number | null>(null);
  const [createdPayable, setCreatedPayable] = useState<number | null>(null);
  const isRecorded = createdAppId !== null;

  // The case this screen works on: the one it was opened with, or the one just
  // recorded here — the latter is how the backend amount becomes available.
  const payAppId = cameFromCase ? appId : createdAppId;
  const query = useDebtorApp(payAppId);
  const app = query.data;

  // Opened from the list there are no applicant params — fall back to the
  // logged-in user's profile for the applicant block.
  const [profile, setProfile] = useState<UserDetail | null>(null);
  useEffect(() => {
    if (isGuestMode()) return;
    getUserMe()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const profileName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');
  const applicantPnValue = applicantId?.trim() || profile?.idnumber || '';
  const applicantNameValue = applicantName?.trim() || profileName;

  const [subjectId, setSubjectId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectAddress, setSubjectAddress] = useState('');
  const [payCode, setPayCode] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  // Pay button switches the screen to the fee/methods phase (shared with the
  // old extract flow); back returns to the form.
  const [phase, setPhase] = useState<'form' | 'payment'>('form');
  const [method, setMethod] = useState<DebtorExtractPaymentMethod>(
    defaultDebtorExtractPaymentMethod,
  );

  // From the list this screen starts a brand-new application, so the
  // requested-person fields are typed in directly; they lock after recording.
  // Entered from an existing case, they stay locked (edit via the modal).
  const subjectEditable = !cameFromCase && !isRecorded;
  const [subjectIdError, setSubjectIdError] = useState(false);

  const createMutation = useCreateDebtorApp();
  const updateMutation = useUpdateDebtorApp(createdAppId);

  const { personId } = useDebtorAppPersons(payAppId);
  const { paymentUrl, startPayment, closePayment, isPaying, isPaid } =
    useDebtorPayment();

  // A settled, successful payment ends the flow — go back to the list. A failed
  // one leaves the user here so they can try again.
  useEffect(() => {
    if (!isPaid) return;
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/debtors');
    }
  }, [isPaid]);

  const handlePay = () => {
    if (payAppId == null) {
      Toast.show({
        type: 'info',
        text1: t('debtors.payRecordFirst'),
        visibilityTime: ToastLayout.visibilityMs,
        position: 'top',
      });
      return;
    }
    const amount = app?.payableAmount ?? createdPayable ?? 0;
    if (personId == null) {
      showErrorToast(t('debtors.payError'), new Error('personId missing'));
      return;
    }
    if (!(amount > 0)) {
      Toast.show({
        type: 'info',
        text1: t('debtors.payNoAmount'),
        visibilityTime: ToastLayout.visibilityMs,
        position: 'top',
      });
      return;
    }
    startPayment({ appId: payAppId, personId, amount });
  };

  // Seed the requested-person fields once the app detail arrives.
  useEffect(() => {
    setSubjectId(app?.requestedPerson?.idnumber ?? '');
    setSubjectName(app?.requestedPerson?.personName ?? '');
    setSubjectAddress(app?.requestedPerson?.address ?? '');
  }, [
    app?.requestedPerson?.idnumber,
    app?.requestedPerson?.personName,
    app?.requestedPerson?.address,
  ]);

  const handleRecord = () => {
    if (subjectEditable && !/^\d{9}$|^\d{11}$/.test(subjectId.trim())) {
      setSubjectIdError(true);
      return;
    }
    createMutation.mutate(
      {
        personName: subjectName.trim(),
        idnumber: subjectId.trim(),
        address: subjectAddress.trim() || undefined,
        addInfo: app?.requestedPerson?.addInfo ?? undefined,
        note: app?.requestedPerson?.note ?? undefined,
      },
      {
        onSuccess: ({ app: created, payCode: fetchedPayCode }) => {
          setPayCode(fetchedPayCode);
          setCreatedAppId(created.id);
          setCreatedPayable(created.payableAmount ?? null);
          Toast.show({
            type: 'success',
            text1: t('debtors.extractRecordSuccess'),
            visibilityTime: ToastLayout.visibilityMs,
            position: 'top',
          });
        },
      },
    );
  };

  const handleEditSave = ({ name, idnumber }: { name: string; idnumber: string }) => {
    // Before recording there is nothing to PUT to — just update the draft.
    if (!isRecorded) {
      setSubjectName(name);
      setSubjectId(idnumber);
      setEditVisible(false);
      return;
    }
    updateMutation.mutate(
      {
        personName: name,
        idnumber,
        address: subjectAddress.trim() || undefined,
        addInfo: app?.requestedPerson?.addInfo ?? undefined,
        note: app?.requestedPerson?.note ?? undefined,
      },
      {
        onSuccess: () => {
          setSubjectName(name);
          setSubjectId(idnumber);
          Toast.show({
            type: 'success',
            text1: t('debtors.detailEditSuccess'),
            visibilityTime: ToastLayout.visibilityMs,
            position: 'top',
          });
          setEditVisible(false);
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-bg">
      <DebtorExtractSubheader
        title={t('debtors.extractRequestButton')}
        backA11y={t('debtors.extractBackA11y')}
        onBack={() => (phase === 'payment' ? setPhase('form') : router.back())}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 20 }}
        keyboardShouldPersistTaps="handled">
        {phase === 'payment' ? (
          <DebtorExtractPhasePayment
            selected={method}
            onSelect={setMethod}
            onPay={handlePay}
            paying={isPaying}
            amount={app?.payableAmount ?? createdPayable}
          />
        ) : (
          <>
            <Card className="gap-4">
              <Text className="text-body font-bold text-fg">
                {t('debtors.extractApplicantSection')}
              </Text>
              <Field label={t('debtors.extractApplicantPnLabel')} value={applicantPnValue} />
              <Field
                label={t('debtors.extractApplicantNameLabel')}
                value={applicantNameValue}
              />
              {payCode ? (
                <Field label={t('debtors.detailLabelPayCode')} value={payCode} />
              ) : null}
            </Card>
            <Card className="gap-4">
              <Text className="text-body font-bold text-fg">
                {t('debtors.extractSubjectSection')}
              </Text>
              <Field
                label={t('debtors.extractSubjectIdLabel')}
                value={subjectId}
                onChangeText={
                  subjectEditable
                    ? (v) => {
                        setSubjectId(v.replace(/\D/g, ''));
                        if (subjectIdError) setSubjectIdError(false);
                      }
                    : undefined
                }
                keyboardType="number-pad"
                maxLength={11}
                required={subjectEditable}
              />
              {subjectIdError ? (
                <Text className="text-caption text-danger">{t('debtors.detailEditIdError')}</Text>
              ) : null}
              <Field
                label={t('debtors.extractSubjectNameLabel')}
                value={subjectName}
                onChangeText={subjectEditable ? setSubjectName : undefined}
                required={subjectEditable}
              />
            </Card>
            <Button
              label={t('debtors.extractRecordButton')}
              disabled={createMutation.isPending || isRecorded}
              loading={createMutation.isPending}
              onPress={handleRecord}
            />
            {/* Editing and paying only make sense once the application exists. */}
            {isRecorded ? (
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Button
                    label={t('debtors.detailEditButton')}
                    variant="secondary"
                    onPress={() => setEditVisible(true)}
                  />
                </View>
                <View className="flex-1">
                  <Button
                    label={t('debtors.extractPayButton')}
                    disabled={isPaying}
                    onPress={handlePay}
                  />
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
      <PaymentWebViewModal
        visible={paymentUrl != null}
        url={paymentUrl}
        onClose={closePayment}
      />
      <DebtorAppEditModal
        visible={editVisible}
        name={subjectName}
        idnumber={subjectId}
        saving={updateMutation.isPending}
        onClose={() => setEditVisible(false)}
        onSave={handleEditSave}
      />
    </View>
  );
}
