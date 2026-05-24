import { Text, View } from 'react-native';

import { unreadCountBadgeStyles as s } from '@/components/ui/unread-count-badge.styles';

function formatBadgeCount(value: number) {
  if (value > 99) {
    return '99+';
  }
  return String(value);
}

export function UnreadCountBadge({ count, loading, small }: { count: number; loading?: boolean; small?: boolean }) {
  const badgeText = loading ? '...' : formatBadgeCount(count);
  return (
    <View style={small ? s.wrapSmall : s.wrap} accessibilityRole="text">
      <Text style={small ? s.labelSmall : s.label}>{badgeText}</Text>
    </View>
  );
}
