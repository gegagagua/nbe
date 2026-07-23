import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import { LoginPalette } from '@/constants/login';
import { ToastLayout } from '@/constants/toast';
import { getUserMe } from '@/api/users';
import { useCreateDebtorApp } from '@/hooks/use-create-debtor-app';
import { useDebtorApp } from '@/hooks/use-debtor-app';
import { useUpdateDebtorApp } from '@/hooks/use-update-debtor-app';
import { isGuestMode } from '@/lib/guest-mode';
import type { UserDetail } from '@/types/users';
import type { DebtorExtractPaymentMethod } from '@/types/debtor-extract';
import { defaultDebtorExtractPaymentMethod } from '@/utils/debtor-extract-payment-options';

import { debtorAppDetailActionsStyles as da } from './debtor-app-detail-actions.styles';
import { DebtorAppEditModal } from './debtor-app-edit-modal';
import { DebtorExtractPhasePayment } from './debtor-extract-phase-payment';
import { debtorExtractRequestStyles as s } from './debtor-extract-request.styles';
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
}: {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  keyboardType?: 'number-pad' | 'phone-pad';
  maxLength?: number;
}) {
  const editable = Boolean(onChangeText);
  return (
    <View style={s.fieldGap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholderTextColor={LoginPalette.placeholderMuted}
        style={[s.input, !editable && s.inputDisabled]}
      />
    </View>
  );
}

export function DebtorAppExtractRequestScreen() {
  const { t } = useTranslation();
  const { id, applicantName, applicantId } = useLocalSearchParams<Params>();
  const appId = Number(id);
  const query = useDebtorApp(Number.isFinite(appId) ? appId : null);
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

  // Set once recorded — locks the form and switches editing over to PUT.
  const [createdAppId, setCreatedAppId] = useState<number | null>(null);
  const isRecorded = createdAppId !== null;

  // From the list this screen starts a brand-new application, so the
  // requested-person fields are typed in directly; they lock after recording.
  // Entered from an existing case, they stay locked (edit via the modal).
  const cameFromCase = Number.isFinite(appId);
  const subjectEditable = !cameFromCase && !isRecorded;
  const [subjectIdError, setSubjectIdError] = useState(false);

  const createMutation = useCreateDebtorApp();
  const updateMutation = useUpdateDebtorApp(createdAppId);

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
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <DebtorExtractSubheader
          title={t('debtors.extractRequestButton')}
          backA11y={t('debtors.extractBackA11y')}
          onBack={() => (phase === 'payment' ? setPhase('form') : router.back())}
        />
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled">
          {phase === 'payment' ? (
            <DebtorExtractPhasePayment
              selected={method}
              onSelect={setMethod}
              onPay={() => {
                // TODO: wire the real payment once the backend endpoint exists.
              }}
            />
          ) : (
            <>
          <View style={s.sectionCard}>
            <Text style={s.sectionTitle}>{t('debtors.extractApplicantSection')}</Text>
            <Field label={t('debtors.extractApplicantPnLabel')} value={applicantPnValue} />
            <Field
              label={t('debtors.extractApplicantNameLabel')}
              value={applicantNameValue}
            />
            {payCode ? (
              <Field label={t('debtors.detailLabelPayCode')} value={payCode} />
            ) : null}
          </View>
          <View style={s.sectionCard}>
            <Text style={s.sectionTitle}>{t('debtors.extractSubjectSection')}</Text>
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
            />
            {subjectIdError ? (
              <Text style={s.errorText}>{t('debtors.detailEditIdError')}</Text>
            ) : null}
            <Field
              label={t('debtors.extractSubjectNameLabel')}
              value={subjectName}
              onChangeText={subjectEditable ? setSubjectName : undefined}
            />
          </View>
          <Pressable
            style={[
              da.fullBtn,
              (createMutation.isPending || isRecorded) && da.btnDisabled,
            ]}
            accessibilityRole="button"
            disabled={createMutation.isPending || isRecorded}
            onPress={handleRecord}>
            <Text style={da.payLabel}>{t('debtors.extractRecordButton')}</Text>
          </Pressable>
          <View style={da.row}>
            <Pressable
              style={[da.btn, da.editBtn]}
              accessibilityRole="button"
              onPress={() => setEditVisible(true)}>
              <Text style={da.editLabel}>{t('debtors.detailEditButton')}</Text>
            </Pressable>
            <Pressable
              style={[da.btn, da.payBtn]}
              accessibilityRole="button"
              onPress={() => setPhase('payment')}>
              <Text style={da.payLabel}>{t('debtors.extractPayButton')}</Text>
            </Pressable>
          </View>
            </>
          )}
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
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
