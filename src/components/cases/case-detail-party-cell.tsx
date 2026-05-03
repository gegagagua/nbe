import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';

type PartyLike = {
  titleLine: string;
  addressLines: readonly string[] | string[];
  paymentIdentifier: string;
};

export function CaseDetailPartyCell({ party }: { party: PartyLike }) {
  const { t } = useTranslation();
  return (
    <View>
      <Text style={s.primaryText}>{party.titleLine}</Text>
      {party.addressLines.map((line) => (
        <Text key={line} style={s.mutedText}>
          {line}
        </Text>
      ))}
      <Text style={s.paymentId}>
        {t('cases.detail.paymentIdLine', { id: party.paymentIdentifier })}
      </Text>
    </View>
  );
}
