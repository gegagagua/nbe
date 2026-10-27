import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { formatRecordCount } from '@/utils/format-record-count';

const WINDOW = 5;

function visiblePages(current: number, total: number): number[] {
  if (total <= 0) {
    return [];
  }
  const lastIdx = total - 1;
  const width = Math.min(WINDOW, total);
  const start = Math.min(
    Math.max(0, current - Math.floor(width / 2)),
    Math.max(0, lastIdx - width + 1),
  );
  return Array.from({ length: width }, (_, i) => start + i);
}

export type CasePaginationProps = {
  pageNumber: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (nextZeroBased: number) => void;
};

export function CasePagination({
  pageNumber,
  totalPages,
  totalRecords,
  onPageChange,
}: CasePaginationProps) {
  const { t } = useTranslation();
  const tp = Math.max(totalPages, 1);
  const last = tp - 1;
  const disablePrev = pageNumber <= 0;
  const disableNext = pageNumber >= last;
  const pages = visiblePages(pageNumber, tp);
  const totalLabel = t('cases.paginationTotalRecords', {
    count: formatRecordCount(totalRecords),
  });

  return (
    <View className="w-full mt-6 pb-2 gap-2 items-center">
      <Text className="text-caption font-semibold text-fg">{totalLabel}</Text>
      <View className="flex-row flex-wrap items-center justify-center gap-2">
        <Pressable
          className={`rounded-sm border border-border bg-surface px-2 py-2 min-w-[44px] items-center${
            disablePrev ? ' opacity-45' : ''
          }`}
          disabled={disablePrev}
          onPress={() => onPageChange(Math.max(0, pageNumber - 1))}>
          <Text className="text-caption font-bold text-fg">{t('cases.previousPage')}</Text>
        </Pressable>
        {pages.map((idx) => {
          const active = idx === pageNumber;
          return (
            <Pressable
              key={idx}
              className={`min-w-[36px] h-9 rounded-sm border items-center justify-center ${
                active ? 'bg-primary border-primary' : 'border-border bg-surface'
              }`}
              onPress={() => onPageChange(idx)}>
              <Text
                className={`text-caption font-bold ${active ? 'text-on-primary' : 'text-fg'}`}>
                {idx + 1}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          className={`rounded-sm border border-border bg-surface px-2 py-2 min-w-[44px] items-center${
            disableNext ? ' opacity-45' : ''
          }`}
          disabled={disableNext}
          onPress={() => onPageChange(Math.min(last, pageNumber + 1))}>
          <Text className="text-caption font-bold text-fg">{t('cases.nextPage')}</Text>
        </Pressable>
      </View>
      <Text className="text-caption font-semibold text-fg-muted mx-2">
        {pageNumber + 1} / {tp}
      </Text>
    </View>
  );
}
