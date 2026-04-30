import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { DebtorRegistryLinks } from '@/constants/debtor-registry';
import { DebtorRegistryCopy } from '@/constants/debtor-registry-copy';
import { showErrorToast } from '@/lib/show-error-toast';
import type { DebtorRegistryApplication } from '@/types/debtor-registry';

import { debtorAppDetailsModalStyles as s } from './debtor-app-details-modal.styles';

function formatDate(value: string | null) {
  return value ? value.replace('T', ' ') : '-';
}

type Props = {
  app: DebtorRegistryApplication | null;
  onClose: () => void;
};

export function DebtorAppDetailsModal({ app, onClose }: Props) {
  const visible = app !== null;
  if (!app) {
    return null;
  }

  const firstApplicant = app.applicants?.[0];
  const requestedPerson = app.requestedPerson;
  const statusName = app.status?.name ?? '-';
  const canEdit = statusName === 'განცხადება';
  const title = `${DebtorRegistryCopy.detailsTitlePrefix} ${app.id}`;

  const openStatement = async () => {
    try {
      await Linking.openURL(DebtorRegistryLinks.statementBlobUrl);
    } catch (error) {
      showErrorToast(DebtorRegistryCopy.statementOpenError, error);
    }
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.panel}>
          <View style={s.header}>
            <Text style={s.title}>{title}</Text>
            <Pressable onPress={onClose}>
              <Text style={s.close}>
                <MaterialCommunityIcons name="close" size={22} />
              </Text>
            </Pressable>
          </View>
          <View style={s.statementWrap}>
            <Pressable onPress={() => void openStatement()}>
              <Text style={s.statementText}>{DebtorRegistryCopy.statementAction}</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={s.body}>
            <Text style={s.sectionTitle}>
              {canEdit ? DebtorRegistryCopy.detailsEditableSection : DebtorRegistryCopy.detailsReadonlySection}
            </Text>
            <View style={s.row}>
              <View style={s.cell}>
                <Text style={s.label}>პირადი ნომერი</Text>
                <Text style={s.value}>{firstApplicant?.idnumber ?? requestedPerson?.idnumber ?? '-'}</Text>
              </View>
              <View style={s.cell}>
                <Text style={s.label}>სახელი, გვარი</Text>
                <Text style={s.value}>{firstApplicant?.name ?? requestedPerson?.personName ?? '-'}</Text>
              </View>
            </View>
            <View style={s.row}>
              <View style={s.cell}>
                <Text style={s.label}>მისამართი</Text>
                <Text style={s.value}>{firstApplicant?.address ?? requestedPerson?.address ?? '-'}</Text>
              </View>
              <View style={s.cell}>
                <Text style={s.label}>ჩანაწერი</Text>
                <Text style={s.value}>{formatDate(app.createdDate)}</Text>
              </View>
            </View>
            <View style={s.row}>
              <View style={s.cell}>
                <Text style={s.label}>საქმის ნომერი</Text>
                <Text style={s.value}>{app.caseNo ?? '-'}</Text>
              </View>
              <View style={s.cell}>
                <Text style={s.label}>სტატუსი</Text>
                <Text style={s.value}>{statusName}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
