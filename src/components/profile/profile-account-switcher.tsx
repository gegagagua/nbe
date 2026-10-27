import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { LoginPalette } from '@/constants/login';

import type { ProfileAccountOption } from './profile-account-switch-modal';
import { profileAccountSwitchModalStyles as rowS } from './profile-account-switch-modal.styles';
import { profileScreenStyles as s } from './profile-screen.styles';

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

  // Only the personal account and nothing to switch to — no switcher needed.
  if (!isLoading && accounts.length <= 1) return null;

  return (
    <View style={s.card}>
      <Text style={s.sectionTitle}>{t('profile.switchAccountTitle')}</Text>

      {isLoading && accounts.length === 0 ? (
        <ActivityIndicator style={rowS.loader} size="small" color={LoginPalette.primary} />
      ) : (
        accounts.map((account) => {
          const selected = account.id === selectedId;
          return (
            <Pressable
              key={account.id}
              style={({ pressed }) => [rowS.row, pressed && rowS.rowPressed]}
              onPress={() => onSelect(account)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}>
              <View style={[rowS.radio, selected && rowS.radioSelected]}>
                {selected ? <View style={rowS.radioDot} /> : null}
              </View>
              <Text style={rowS.rowText} numberOfLines={2}>
                {account.name}
              </Text>
            </Pressable>
          );
        })
      )}
    </View>
  );
}
