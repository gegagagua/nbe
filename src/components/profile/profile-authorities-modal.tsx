import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { Space } from '@/constants/theme';
import type { UserAuthority } from '@/types/user-authority';

import { ProfileAuthorityItem } from './profile-authority-item';
import { profileInfoSheetModalStyles as s } from './profile-info-sheet-modal.styles';

type Props = {
  visible: boolean;
  authorities: UserAuthority[];
  onClose: () => void;
};

export function ProfileAuthoritiesModal({ visible, authorities, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <ModalBackdrop onClose={onClose} style={s.overlay}>
        <View style={s.sheet}>
          <Text style={s.title}>{t('profile.activitiesModalTitle')}</Text>

          {authorities.length === 0 ? (
            <Text style={s.emptyText}>{t('profile.activitiesEmpty')}</Text>
          ) : (
            <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
              <View style={{ gap: Space.small }}>
                {authorities.map((item) => (
                  <ProfileAuthorityItem key={String(item.id ?? item.keyword)} authority={item} />
                ))}
              </View>
            </ScrollView>
          )}

          <Pressable style={s.closeButton} onPress={onClose} accessibilityRole="button">
            <Text style={s.closeButtonText}>{t('passwordHistory.closeButton')}</Text>
          </Pressable>
        </View>
      </ModalBackdrop>
    </Modal>
  );
}
