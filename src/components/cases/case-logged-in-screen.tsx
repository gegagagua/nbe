import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CaseFilters } from '@/components/cases/case-filters';
import { CaseList } from '@/components/cases/case-list';
import { CasePagination } from '@/components/cases/case-pagination';
import { HomeHeader } from '@/components/home/home-header';
import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import {
  USE_CASE_LIST_LAYOUT_MOCK,
  getCaseListLayoutMockSlice,
  getCaseScreenHeaderMockDisplayName,
} from '@/constants/case-list-layout-mock';
import { useCaseApps } from '@/hooks/use-case-apps';
import type { CaseSearchFilters } from '@/types/case-management';
import { isCaseFiltersEmpty } from '@/utils/is-case-filters-empty';

import { caseScreenStyles as s } from './case-screen.styles';

export function CaseLoggedInScreen() {
  const { t, i18n } = useTranslation();
  const displayName = getCaseScreenHeaderMockDisplayName(i18n.language);
  const [draftFilters, setDraftFilters] = useState<CaseSearchFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<CaseSearchFilters>({});
  const [pageNumber, setPageNumber] = useState(0);
  const query = useCaseApps(appliedFilters, pageNumber, {
    enabled: !USE_CASE_LIST_LAYOUT_MOCK,
  });
  const mockSlice = USE_CASE_LIST_LAYOUT_MOCK
    ? getCaseListLayoutMockSlice(pageNumber, i18n.language)
    : null;
  const items = mockSlice?.data ?? query.data?.data ?? [];
  const page = mockSlice?.page ?? query.data?.page;
  const totalPages = page?.totalPages ?? 1;
  const totalRecords = page?.totalRecords ?? 0;
  const queryIsLoading = USE_CASE_LIST_LAYOUT_MOCK ? false : query.isLoading;
  const emptyList = !queryIsLoading && items.length === 0;
  const emptyNoProceedings = emptyList && isCaseFiltersEmpty(appliedFilters);

  const onSearch = () => {
    setPageNumber(0);
    setAppliedFilters(draftFilters);
  };
  const onClear = () => {
    setDraftFilters({});
    setAppliedFilters({});
    setPageNumber(0);
  };

  return (
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <HomeHeader displayName={displayName} />
        <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator>
          <View style={s.titleRow}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              style={s.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#2b436c" />
            </Pressable>
            <Text style={s.title}>{t('cases.pageTitle')}</Text>
          </View>
          <CaseFilters
            values={draftFilters}
            onChange={setDraftFilters}
            onSearch={onSearch}
            onClear={onClear}
          />
          <View style={s.listWrap}>
            <CaseList
              items={items}
              loading={queryIsLoading}
              empty={emptyList}
              emptyNoProceedings={emptyNoProceedings}
            />
            {!queryIsLoading && items.length > 0 && (
              <CasePagination
                pageNumber={pageNumber}
                totalPages={totalPages}
                totalRecords={totalRecords}
                onPageChange={setPageNumber}
              />
            )}
          </View>
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
