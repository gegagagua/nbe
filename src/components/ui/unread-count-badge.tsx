import { Text, View } from 'react-native';

function formatBadgeCount(value: number) {
  if (value > 99) {
    return '99+';
  }
  return String(value);
}

export function UnreadCountBadge({ count, loading, small }: { count: number; loading?: boolean; small?: boolean }) {
  const badgeText = loading ? '...' : formatBadgeCount(count);
  return (
    <View
      className={
        small
          ? 'min-w-[18px] h-[18px] rounded-[9px] px-1 bg-danger items-center justify-center'
          : 'min-w-[43px] h-[35px] rounded-[11px] px-1.5 bg-danger items-center justify-center'
      }
      accessibilityRole="text">
      <Text
        className={
          small
            ? 'text-on-danger text-[10px] font-extrabold leading-[14px]'
            : 'text-on-danger text-[16px] font-extrabold leading-[22px]'
        }>
        {badgeText}
      </Text>
    </View>
  );
}
