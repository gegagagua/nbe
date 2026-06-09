import type { AppDemandSummary } from '@/types/case-demands';
import type { CaseApplication } from '@/types/case-management';

export function mergeCaseListDebts(
  items: CaseApplication[],
  debtsByAppId: Map<number, AppDemandSummary>,
): CaseApplication[] {
  return items.map((item) => {
    const debt = debtsByAppId.get(item.id);
    if (!debt) return item;
    return {
      ...item,
      debtCategoryName: debt.debtCategoryName ?? item.debtCategoryName,
      debtAmountDisplay: debt.debtAmountDisplay ?? item.debtAmountDisplay,
    };
  });
}
