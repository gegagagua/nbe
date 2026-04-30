import type {
  CaseApplication,
  SearchCasesResponse,
} from "@/types/case-management";

import { CASE_LIST_LAYOUT_MOCK_ROWS_A } from "./case-list-layout-mock-rows-a";
import { CASE_LIST_LAYOUT_MOCK_ROWS_B } from "./case-list-layout-mock-rows-b";

/**
 * UI მაკეტის პრევიუ: სიის/წაუკიტებლების API არ მოდის; `cases` / `cases/[id]` სესიის რედირექტს არ აკეთებს.
 * ბექის ჩასართავად და ავტორიზაციის დაბრუნებად: `false`.
 */
export const USE_CASE_LIST_LAYOUT_MOCK = true;

/** ჰედერი / წაუკიტებლები — `case-screen`-ში ჰუკების ნაცვლად (დროებითი მოკი). */
export const CASE_SCREEN_HEADER_MOCK = {
  displayName: "ნინო მაგალითაძე",
  unreadCount: 2,
  unreadLoading: false,
} as const;

const PAGE_SIZE = 5;
const TOTAL_RECORDS_UI = 285;
const TOTAL_PAGES_UI = 12;

const ROWS: CaseApplication[] = [
  ...CASE_LIST_LAYOUT_MOCK_ROWS_A,
  ...CASE_LIST_LAYOUT_MOCK_ROWS_B,
];

export function getCaseListLayoutMockSlice(
  pageNumber: number,
): SearchCasesResponse {
  const start = pageNumber * PAGE_SIZE;
  const data: CaseApplication[] = [];
  for (let i = 0; i < PAGE_SIZE; i += 1) {
    const template = ROWS[(start + i) % ROWS.length];
    const variantId = template.id + pageNumber * 10000 + i;
    data.push({
      ...template,
      id: variantId,
    });
  }
  return {
    data,
    page: {
      totalRecords: TOTAL_RECORDS_UI,
      totalPages: TOTAL_PAGES_UI,
      size: PAGE_SIZE,
      number: pageNumber,
    },
  };
}
