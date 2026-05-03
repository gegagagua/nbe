export const DebtorExtractMockApplicant = {
  personalId: '61004030586',
  firstName: 'გიორგი',
  lastName: 'ბერიძე',
} as const;

export const DebtorExtractMockSubject = {
  personalId: '05001012696',
  fullName: 'ნინო მელაძე',
} as const;

export function debtorExtractMockApplicationNumber(): string {
  return 'MR-2026-0891';
}
