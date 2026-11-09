import { NewsApiPaths } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import { mapFaqs } from "@/lib/map-faqs";
import type {
  FaqCategoriesEnvelope,
  FaqCategoryDto,
  FaqItem,
} from "@/types/faq";

/** GET /news-portal-pub/v1/faqs — ხშირად დასმული კითხვები (mapped Q/A rows). */
export async function fetchFaqs(): Promise<FaqItem[]> {
  const response = await apiClient.get(NewsApiPaths.faqs);
  return mapFaqs(response.data);
}

/** GET /news-portal-pub/v1/faq-categories — FAQ category dictionary. */
export async function fetchFaqCategories(): Promise<FaqCategoryDto[]> {
  const response = await apiClient.get<FaqCategoriesEnvelope>(
    NewsApiPaths.faqCategories,
  );
  return response.data.data ?? [];
}
