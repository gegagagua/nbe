import type { SearchCasesResponse } from '@/types/case-management';

/** დროებითი მოკი — სიის UI / ფილტრების ტესტი ბექის გარეშე. */
export const MOCK_SEARCH_CASES_RESPONSE: SearchCasesResponse = {
  data: [
    {
      id: 9001,
      inputDate: '2025-03-01T10:00:00',
      regnumber: 'MOCK-001',
      regDate: '2025-03-02',
      finalRegistrationAt: '2026-04-29T12:21:45',
      statusDate: '2025-03-15',
      debtCategoryName: 'თანხის დაკისრება — კატეგორია A',
      debtAmountDisplay: '1 250.00 ₾',
      status: { id: 1, name: 'მიმდინარე', colorCode: '#2b436c' },
      trType: { id: 1, prefix: 'ENG', name: 'დავალება (მოკ)' },
      creditors: [
        {
          id: 1,
          firstName: 'ილია',
          lastName: 'მაზიაშვილი',
          organization: null,
          idnumber: '61001012345',
        },
      ],
      debtors: [
        {
          id: 2,
          firstName: 'ნინო',
          lastName: 'ქართველი',
          organization: null,
          idnumber: '62002054321',
        },
      ],
    },
    {
      id: 9002,
      inputDate: '2025-03-10T14:30:00',
      regnumber: 'MOCK-002',
      regDate: '2025-03-11',
      finalRegistrationAt: '2026-04-30T09:15:30',
      statusDate: '2025-03-20',
      debtCategoryName: 'საურმო სერვისი',
      debtAmountDisplay: '480.50 ₾',
      status: { id: 2, name: 'დასრულებული', colorCode: '#6b7a90' },
      trType: { id: 2, prefix: 'ADM', name: 'ადმინისტრაციული (მოკ)' },
      creditors: [
        {
          id: 3,
          firstName: null,
          lastName: null,
          organization: 'სს „მოკ კომპანია"',
          idnumber: '405012345',
        },
      ],
      debtors: [
        {
          id: 4,
          firstName: 'გიორგი',
          lastName: 'ბერიძე',
          organization: null,
          idnumber: '01003098765',
        },
      ],
    },
  ],
  page: {
    totalRecords: 2,
    totalPages: 1,
    size: 10,
    number: 0,
  },
};
