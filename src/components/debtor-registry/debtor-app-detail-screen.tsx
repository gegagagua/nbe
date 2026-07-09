import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import { useDebtorApp } from '@/hooks/use-debtor-app';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

import { debtorExtractRequestStyles as s } from './debtor-extract-request.styles';
import { DebtorExtractSubheader } from './debtor-extract-subheader';
import { DebtorRegistryApplicationRowActions } from './debtor-registry-application-row-actions';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.fieldGap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={s.readonlyValue}>{value}</Text>
    </View>
  );
}

export function DebtorAppDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Number(id);
  const query = useDebtorApp(Number.isFinite(appId) ? appId : null);
  const app = query.data;

  const payableAmount =
    app?.payableAmount != null
      ? t('debtors.detailPayableAmountValue', { amount: String(app.payableAmount) })
      : '—';

  return (
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <DebtorExtractSubheader
          title={t('debtors.detailsTitlePrefix')}
          backA11y={t('debtors.extractBackA11y')}
          onBack={() => router.back()}
        />
        <ScrollView style={s.scroll} contentContainerStyle={s.content}>
          {query.isPending ? (
            <Text style={s.hintText}>{t('debtors.loadingMessage')}</Text>
          ) : null}
          {app ? (
            <>
              <View style={s.sectionCard}>
                <Text style={s.sectionTitle}>{t('debtors.detailCaseSection')}</Text>
                <Field
                  label={t('debtors.detailLabelRegNumber')}
                  value={app.regnumber?.trim() || `#${app.id}`}
                />
                <Field
                  label={t('debtors.detailLabelRegDate')}
                  value={formatEnforcementDateTime(app.regDate)}
                />
                <Field
                  label={t('debtors.detailsLabelStatus')}
                  value={app.status?.name ?? '—'}
                />
                <Field
                  label={t('debtors.detailLabelStatusDate')}
                  value={formatEnforcementDateTime(app.statusDate)}
                />
                <Field
                  label={t('debtors.detailLabelTrType')}
                  value={app.trType?.name ?? '—'}
                />
                <Field
                  label={t('debtors.detailLabelPayableAmount')}
                  value={payableAmount}
                />
              </View>
              <View style={s.sectionCard}>
                <Text style={s.sectionTitle}>{t('debtors.extractSubjectSection')}</Text>
                <Field
                  label={t('debtors.extractSubjectNameLabel')}
                  value={app.requestedPerson?.personName ?? '—'}
                />
                <Field
                  label={t('debtors.extractSubjectIdLabel')}
                  value={app.requestedPerson?.idnumber ?? '—'}
                />
                <Field
                  label={t('debtors.detailsLabelAddress')}
                  value={app.requestedPerson?.address ?? '—'}
                />
              </View>
              <View style={s.sectionCard}>
                <Text style={s.sectionTitle}>{t('debtors.detailCreatedSection')}</Text>
                <Field
                  label={t('debtors.detailLabelCreatedDate')}
                  value={formatEnforcementDateTime(app.createdDate)}
                />
                <Field
                  label={t('debtors.detailLabelCreatedBy')}
                  value={app.createdBy?.name ?? '—'}
                />
              </View>
              <DebtorRegistryApplicationRowActions app={app} />
            </>
          ) : null}
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
