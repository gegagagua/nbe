import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';
import type { UserAuthority } from '@/types/user-authority';

type Props = {
  authority: UserAuthority;
};

export function ProfileAuthorityItem({ authority }: Props) {
  const { t } = useTranslation();
  const isActive = authority.active !== false;
  const typeName = authority.type?.name?.trim();

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <Text style={s.name}>{authority.name?.trim() || '—'}</Text>
        <Text style={[s.badge, isActive ? s.badgeActive : s.badgeInactive]}>
          {isActive ? t('profile.authorityActive') : t('profile.authorityInactive')}
        </Text>
      </View>
      {authority.keyword ? (
        <Text style={s.meta}>{authority.keyword}</Text>
      ) : null}
      {typeName ? (
        <Text style={s.meta}>
          {t('profile.authorityTypeLabel')}: {typeName}
        </Text>
      ) : null}
      {authority.description?.trim() ? (
        <Text style={s.description}>{authority.description.trim()}</Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#f5f7fa',
    borderRadius: Radius.small,
    paddingHorizontal: Space.small,
    paddingVertical: Space.extraSmall,
    gap: Space.extraSmall,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Space.small,
  },
  name: {
    flex: 1,
    fontSize: Typography.medium,
    fontWeight: '700',
    color: LoginPalette.titleText,
  },
  badge: {
    fontSize: Typography.small,
    fontWeight: '600',
    paddingHorizontal: Space.extraSmall,
    paddingVertical: 2,
    borderRadius: Radius.extraSmall,
    overflow: 'hidden',
  },
  badgeActive: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  badgeInactive: {
    backgroundColor: '#fce8e8',
    color: LoginPalette.errorText,
  },
  meta: {
    fontSize: Typography.small,
    color: LoginPalette.placeholderMuted,
  },
  description: {
    fontSize: Typography.small,
    color: LoginPalette.bodyText,
    lineHeight: 18,
  },
});
