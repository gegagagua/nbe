import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { HomeHeader } from '@/components/home/home-header';
import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import type { DebtorRegistryApplication, DebtorRegistryPage } from '@/types/debtor-registry';

import { DebtorRegistryApplicationList } from './debtor-registry-application-list';
import { DebtorRegistryExtractCta } from './debtor-registry-extract-cta';
import { debtorRegistryScreenStyles as s } from './debtor-registry-screen.styles';

type Props = {
  displayName: string;
  items: DebtorRegistryApplication[];
  loading: boolean;
  empty: boolean;
  listEmptyText?: string;
  searchForm?: ReactNode;
  pageInfo: DebtorRegistryPage | undefined;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

export function DebtorRegistryScreenInner({
  displayName,
  items,
  loading,
  empty,
  listEmptyText,
  searchForm,
  pageInfo,
  page,
  setPage,
}: Props) {
  const { t } = useTranslation();
  return (
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <HomeHeader displayName={displayName} />
        <View style={s.scrollPane}>
          <ScrollView
            style={s.contentScroll}
            contentContainerStyle={s.contentWrap}
            keyboardShouldPersistTaps="handled">
            <View style={s.titleRow}>
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                style={s.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={22} color="#2b436c" />
              </Pressable>
              <Text style={s.titleText}>{t('debtors.pageTitle')}</Text>
            </View>
            {searchForm}
            <View style={s.listWrap}>
              <DebtorRegistryApplicationList
                items={items}
                loading={loading}
                empty={empty}
                emptyText={listEmptyText}
              />
            </View>
            {pageInfo && pageInfo.totalPages > 1 ? (
              <View style={s.pagination}>
                <Pressable
                  style={[s.pageButton, page <= 0 && s.pageButtonDisabled]}
                  disabled={page <= 0}
                  onPress={() => setPage((p) => Math.max(0, p - 1))}>
                  <Text style={s.pageButtonText}>{t('debtors.previousPage')}</Text>
                </Pressable>
                <Text style={s.pageText}>
                  {page + 1} / {pageInfo.totalPages}
                </Text>
                <Pressable
                  style={[s.pageButton, page >= pageInfo.totalPages - 1 && s.pageButtonDisabled]}
                  disabled={page >= pageInfo.totalPages - 1}
                  onPress={() => setPage((p) => p + 1)}>
                  <Text style={s.pageButtonText}>{t('debtors.nextPage')}</Text>
                </Pressable>
              </View>
            ) : null}
          </ScrollView>
        </View>
        <View style={s.extractDock}>
          <DebtorRegistryExtractCta />
        </View>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
