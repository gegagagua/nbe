import type {
  FaqCategoryGroup,
  FaqEnvelope,
  FaqItem,
} from "@/types/faq";

const text = (value: string | null | undefined) => value?.trim() ?? "";

/**
 * Map the FAQ list response into question/answer rows. Inactive entries and
 * rows missing both a question and an answer are dropped.
 */
export function mapFaqs(envelope: FaqEnvelope): FaqItem[] {
  return (envelope?.data ?? [])
    .filter((dto) => dto.active !== false)
    .map((dto) => ({
      id: dto.id,
      question: text(dto.question),
      answer: text(dto.answer),
      categoryId: dto.category?.id ?? null,
      categoryName: text(dto.category?.name),
    }))
    .filter((item) => item.question || item.answer);
}

/** Group FAQ rows under their category, preserving first-seen order. */
export function groupFaqsByCategory(items: FaqItem[]): FaqCategoryGroup[] {
  const groups: FaqCategoryGroup[] = [];
  const byKey = new Map<number | string, FaqCategoryGroup>();
  for (const item of items) {
    const key = item.categoryId ?? "__uncategorized__";
    let group = byKey.get(key);
    if (!group) {
      group = {
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        items: [],
      };
      byKey.set(key, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}
