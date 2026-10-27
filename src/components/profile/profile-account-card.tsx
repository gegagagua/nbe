import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { LoginPalette } from '@/constants/login';

import { profileAccountCardStyles as s } from './profile-account-card.styles';

type Props = {
  fullName: string;
  subtitle: string;
  onViewInfo: () => void;
};

export function ProfileAccountCard({ fullName, subtitle, onViewInfo }: Props) {
  return (
    <View style={s.card}>
      <Pressable
        style={({ pressed }) => [s.main, pressed && s.pressed]}
        onPress={onViewInfo}
        accessibilityRole="button"
      >
        <View style={s.avatar}>
          <MaterialCommunityIcons name="account" size={24} color={LoginPalette.primary} />
        </View>
        <View style={s.textWrap}>
          <Text style={s.name} numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={s.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
