import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { useAppTheme } from '@/theme';

import type { ProfileAccountOption } from './profile-account-switch-modal';

type Props = {
  accounts: ProfileAccountOption[];
  selectedId: string | null;
  isLoading?: boolean;
  onSelect: (account: ProfileAccountOption) => void;
};

/**
 * Inline account switcher (მომხმარებლის ანგარიში) shown directly in the
 * personal cabinet — radio rows for the physical user and every legal entity
 * they can act as. Replaces the earlier switch-button-opens-a-modal flow, which
 * users found unclear. Hidden when there is nothing to switch to.
 */
export function ProfileAccountSwitcher({ accounts, selectedId, isLoading = false, onSelect }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  // Only the personal account and nothing to switch to — no switcher needed.
  if (!isLoading && accounts.length <= 1) return null;

  return (
    <Card padding="lg" elevation="sm" className="gap-4 rounded-2xl">
      <Text className="text-heading font-bold text-fg">{t('profile.switchAccountTitle')}</Text>

      {isLoading && accounts.length === 0 ? (
        <ActivityIndicator className="py-4" size="small" color={colors.primary} />
      ) : (
        accounts.map((account) => {
          const selected = account.id === selectedId;
          return (
            <Pressable
              key={account.id}
              className="flex-row items-center gap-3 py-3 active:opacity-70"
              onPress={() => onSelect(account)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}>
              <View
                className={`h-[22px] w-[22px] items-center justify-center rounded-full border-2 ${
                  selected ? 'border-primary' : 'border-fg-muted'
                }`}>
                {selected ? <View className="h-[10px] w-[10px] rounded-full bg-primary" /> : null}
              </View>
              <Text className="flex-1 text-body font-semibold uppercase text-fg" numberOfLines={2}>
                {account.name}
              </Text>
            </Pressable>
          );
        })
      )}
    </Card>
  );
}
