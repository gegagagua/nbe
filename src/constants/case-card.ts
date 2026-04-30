import { LoginPalette } from '@/constants/login';

export const CaseCardPalette = {
  cardBorder: '#dde3ee',
  cardBg: '#ffffff',
  partyBoxBg: '#f3f5f9',
  partyBoxBorder: '#e5eaf2',
  divider: '#dce3ed',
  shadowSoft: 'rgba(30, 42, 61, 0.06)',
  sequenceMuted: '#7a869e',
  headline: '#1e2a3d',
  bureauMuted: '#57637a',
  footerSecondary: '#5c6a80',
  paginationActiveBg: LoginPalette.primary,
  paginationActiveText: LoginPalette.onPrimary,
  paginationOutline: '#cfd8ea',
  paginationMutedBg: '#f7f9fc',
} as const;
