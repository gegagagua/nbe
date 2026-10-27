import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type PartyLike = {
  titleLine: string;
  addressLines: readonly string[] | string[];
  paymentIdentifier: string;
};

export function CaseDetailPartyCell({ party }: { party: PartyLike }) {
  const { t } = useTranslation();
  return (
    <View>
      <Text className="text-label font-bold text-fg">{party.titleLine}</Text>
      {party.addressLines.map((line) => (
        <Text key={line} className="text-caption text-fg-secondary">
          {line}
        </Text>
      ))}
      <Text className="mt-1 text-caption text-fg-secondary">
        {t('cases.detail.paymentIdLine', { id: party.paymentIdentifier })}
      </Text>
    </View>
  );
}
