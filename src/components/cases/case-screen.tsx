import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { CaseFilters } from '@/components/cases/case-filters';
import { CaseList } from '@/components/cases/case-list';
import { CasePagination } from '@/components/cases/case-pagination';
import { HomeHeader } from '@/components/home/home-header';
import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import { UnreadCountBadge } from '@/components/ui/unread-count-badge';
import {
  CASE_SCREEN_HEADER_MOCK,
  USE_CASE_LIST_LAYOUT_MOCK,
  getCaseListLayoutMockSlice,
} from '@/constants/case-list-layout-mock';
import { CaseManagementCopy } from '@/constants/case-management-copy';
import { useCaseApps } from '@/hooks/use-case-apps';
// import { useSessionUserProfile } from '@/hooks/use-session-user-profile';
// import { useUnreadNotificationsCount } from '@/hooks/use-unread-notifications-count';
import type { CaseSearchFilters } from '@/types/case-management';
import { isCaseFiltersEmpty } from '@/utils/is-case-filters-empty';

import { caseScreenStyles as s } from './case-screen.styles';

export function CaseScreen() {
  // დროებითი მოკი — პროფილი / წაუკიტებლები (ლოკალური საცავი და API გამორთული).
  // const { displayName } = useSessionUserProfile();
  // const { count, isLoading } = useUnreadNotificationsCount({
  //   enabled: !USE_CASE_LIST_LAYOUT_MOCK,
  // });
  const displayName = CASE_SCREEN_HEADER_MOCK.displayName;
  const count = CASE_SCREEN_HEADER_MOCK.unreadCount;
  const isLoading = CASE_SCREEN_HEADER_MOCK.unreadLoading;
  const [draftFilters, setDraftFilters] = useState<CaseSearchFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<CaseSearchFilters>({});
  const [pageNumber, setPageNumber] = useState(0);
  // მოკის რეჟიმში `searchCases` არ იძახება (`enabled: false`).
  const query = useCaseApps(appliedFilters, pageNumber, {
    enabled: !USE_CASE_LIST_LAYOUT_MOCK,
  });
  const mockSlice = USE_CASE_LIST_LAYOUT_MOCK ? getCaseListLayoutMockSlice(pageNumber) : null;
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
          <View>
            <View style={s.notifWrap}>
              <Text style={s.notifText}>{CaseManagementCopy.notifications}</Text>
              <UnreadCountBadge count={count} loading={isLoading} />
            </View>
            <Text style={s.title}>{CaseManagementCopy.pageTitle}</Text>
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
