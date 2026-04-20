import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CaseFilters } from '@/components/cases/case-filters';
import { CaseList } from '@/components/cases/case-list';
import { HomeHeader } from '@/components/home/home-header';
import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import { UnreadCountBadge } from '@/components/ui/unread-count-badge';
import { CaseManagementCopy } from '@/constants/case-management-copy';
import { useCaseApps } from '@/hooks/use-case-apps';
import { useSessionUserProfile } from '@/hooks/use-session-user-profile';
import { useUnreadNotificationsCount } from '@/hooks/use-unread-notifications-count';
import type { CaseSearchFilters } from '@/types/case-management';

import { caseScreenStyles as s } from './case-screen.styles';

export function CaseScreen() {
  const { displayName } = useSessionUserProfile();
  const { count, isLoading } = useUnreadNotificationsCount();
  const [draftFilters, setDraftFilters] = useState<CaseSearchFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<CaseSearchFilters>({});
  const [pageNumber, setPageNumber] = useState(0);
  const query = useCaseApps(appliedFilters, pageNumber);
  const items = query.data?.data ?? [];
  const page = query.data?.page;
  const totalPages = page?.totalPages ?? 1;
  const disablePrev = pageNumber <= 0;
  const disableNext = pageNumber + 1 >= totalPages;
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
        <ScrollView contentContainerStyle={s.content}>
          <View style={s.titleRow}>
            <Text style={s.title}>{CaseManagementCopy.pageTitle}</Text>
            <View style={s.notifWrap}>
              <Text style={s.notifText}>{CaseManagementCopy.notifications}</Text>
              <UnreadCountBadge count={count} loading={isLoading} />
            </View>
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
              loading={query.isLoading}
              empty={!query.isLoading && items.length === 0}
            />
            {!query.isLoading && items.length > 0 && (
              <View style={s.pagination}>
                <Pressable
                  style={[s.pageButton, disablePrev && s.pageButtonDisabled]}
                  onPress={() => setPageNumber((curr) => Math.max(curr - 1, 0))}
                  disabled={disablePrev}
                >
                  <Text style={s.pageButtonText}>{CaseManagementCopy.previousPage}</Text>
                </Pressable>
                <Text style={s.pageText}>
                  {pageNumber + 1} / {Math.max(totalPages, 1)}
                </Text>
                <Pressable
                  style={[s.pageButton, disableNext && s.pageButtonDisabled]}
                  onPress={() => setPageNumber((curr) => curr + 1)}
                  disabled={disableNext}
                >
                  <Text style={s.pageButtonText}>{CaseManagementCopy.nextPage}</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
