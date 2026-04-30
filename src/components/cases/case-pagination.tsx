import { Pressable, Text, View } from 'react-native';

import { CaseManagementCopy } from '@/constants/case-management-copy';
import { formatRecordCount } from '@/utils/format-record-count';

import { casePaginationStyles as s } from './case-pagination.styles';

const WINDOW = 5;

function visiblePages(current: number, total: number): number[] {
  if (total <= 0) {
    return [];
  }
  const lastIdx = total - 1;
  const width = Math.min(WINDOW, total);
  let start = Math.min(Math.max(0, current - Math.floor(width / 2)), Math.max(0, lastIdx - width + 1));
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
  const tp = Math.max(totalPages, 1);
  const last = tp - 1;
  const disableFirst = pageNumber <= 0;
  const disablePrev = pageNumber <= 0;
  const disableNext = pageNumber >= last;
  const disableLast = pageNumber >= last;
  const pages = visiblePages(pageNumber, tp);
  const totalLabel = CaseManagementCopy.paginationTotalRecords.replace(
    '{count}',
    formatRecordCount(totalRecords),
  );

  return (
    <View style={s.wrap}>
      <Text style={s.totalRecords}>{totalLabel}</Text>
      <View style={s.navRow}>
        <Pressable
          style={[s.edgeBtn, disablePrev && s.edgeBtnDisabled]}
          disabled={disablePrev}
          onPress={() => onPageChange(Math.max(0, pageNumber - 1))}>
          <Text style={s.edgeBtnText}>{CaseManagementCopy.previousPage}</Text>
        </Pressable>
        {pages.map((idx) => {
          const active = idx === pageNumber;
          return (
            <Pressable
              key={idx}
              style={[s.pageBtn, active && s.pageBtnActive]}
              onPress={() => onPageChange(idx)}>
              <Text style={[s.pageBtnText, active && s.pageBtnTextActive]}>{idx + 1}</Text>
            </Pressable>
          );
        })}
        <Pressable
          style={[s.edgeBtn, disableNext && s.edgeBtnDisabled]}
          disabled={disableNext}
          onPress={() => onPageChange(Math.min(last, pageNumber + 1))}>
          <Text style={s.edgeBtnText}>{CaseManagementCopy.nextPage}</Text>
        </Pressable>
      </View>
      <Text style={s.pageIndicator}>
        {pageNumber + 1} / {tp}
      </Text>
    </View>
  );
}
