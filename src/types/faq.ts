// ── FAQ (ხშირად დასმული კითხვები) — news-portal ──────────────────────────────
// GET /news-portal-pub/v1/faqs → { data: FaqDto[] }
// GET /news-portal-pub/v1/faq-categories → { data: FaqCategoryDto[] }

export type FaqCategoryDto = {
  id: number;
  name: string | null;
};

export type FaqDto = {
  id: number;
  active: boolean | null;
  question: string | null;
  answer: string | null;
  category: FaqCategoryDto | null;
};

export type FaqEnvelope = { data: FaqDto[] | null };
export type FaqCategoriesEnvelope = { data: FaqCategoryDto[] | null };

/** One question/answer row (mapped). */
export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  categoryId: number | null;
  categoryName: string;
};

/** FAQ rows grouped under their category, in first-seen order. */
export type FaqCategoryGroup = {
  categoryId: number | null;
  categoryName: string;
  items: FaqItem[];
};
