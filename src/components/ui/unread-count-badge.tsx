import { Text, View } from 'react-native';

import { unreadCountBadgeStyles as s } from '@/components/ui/unread-count-badge.styles';

function formatBadgeCount(value: number) {
  if (value > 99) {
    return '99+';
  }
  return String(value);
}

export function UnreadCountBadge({ count, loading }: { count: number; loading?: boolean }) {
  const badgeText = loading ? '...' : formatBadgeCount(count);
  return (
    <View style={s.wrap} accessibilityRole="text">
      <Text style={s.label}>{badgeText}</Text>
    </View>
  );
}
