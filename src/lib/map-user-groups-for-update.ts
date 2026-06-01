import type { UserGroup, UserGroupFromApi } from '@/types/users';

export function mapUserGroupsForUpdate(
  groups: UserGroupFromApi[] | undefined,
): UserGroup[] {
  if (!groups?.length) return [];
  return groups.flatMap((entry) => {
    const groupId = entry.groupId ?? entry.group?.id;
    if (groupId == null) return [];
    return [
      {
        ...(entry.id != null ? { id: entry.id } : {}),
        groupId,
        ...(entry.expDate ? { expDate: entry.expDate } : {}),
      },
    ];
  });
}
