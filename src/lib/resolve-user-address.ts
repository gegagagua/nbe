import type { UserDetail } from '@/types/users';

export function resolveUserAddress(detail: UserDetail | null | undefined): string | null {
  if (!detail) return null;
  return detail.realAddress ?? detail.legalAddress ?? detail.agency?.address ?? null;
}
