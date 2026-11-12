import { useQuery } from "@tanstack/react-query";

import { fetchFaqs } from "@/api/faqs";

/**
 * Loads the FAQ (ხშირად დასმული კითხვები) list from the news portal. Cached for
 * five minutes — the content rarely changes within a session.
 */
export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: fetchFaqs,
    staleTime: 5 * 60_000,
  });
}
