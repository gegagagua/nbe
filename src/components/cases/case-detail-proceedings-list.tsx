import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/theme';
import type { CaseDetailData } from '@/types/case-detail-data';

import { CaseDetailKvCard, CaseDetailKvCardList } from './case-detail-kv-card';
import { CaseDetailProceedingFiles } from './case-detail-proceeding-files';

export function CaseDetailProceedingsList({
  proceedings,
}: {
  proceedings: CaseDetailData['proceedings'];
}) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <View>
      {proceedings.map((row, idx) => {
        const isOpen = expanded === idx;
        return (
          <View key={`${row.codeLine}-${idx}`} className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
            <Pressable
              className="flex-row items-center justify-between border-b border-border p-2"
              onPress={() => setExpanded(isOpen ? null : idx)}>
              <Text className="text-label font-bold text-fg">
                {row.codeLine ? `${row.codeLine} :: ${row.title}` : row.title}
              </Text>
              <MaterialCommunityIcons
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={colors.primary}
              />
            </Pressable>
            <View className="p-2">
              <Text className="text-caption text-fg-secondary">{row.dateTime}</Text>
              {isOpen ? (
                row.appStatusId != null ? (
                  <CaseDetailProceedingFiles
                    appId={row.appId}
                    appStatusId={row.appStatusId}
                  />
                ) : row.documents.length === 0 ? (
                  <Text className="mt-2 text-caption text-fg-secondary">{t('cases.detail.proceedingsNoDocs')}</Text>
                ) : (
                  <CaseDetailKvCardList>
                    {row.documents.map((doc, di) => (
                      <CaseDetailKvCard
                        key={`${row.codeLine}-${di}-${doc.href}`}
                        rows={[
                          {
                            label: t('cases.detail.colDocument'),
                            value: (
                              <Pressable
                                onPress={() => Linking.openURL(doc.href)}
                                accessibilityRole="link"
                                accessibilityLabel={t('cases.detail.docOpenA11y')}>
                                <Text className="text-label text-primary underline">{doc.title}</Text>
                              </Pressable>
                            ),
                          },
                          { label: t('cases.detail.colActor'), value: doc.actor },
                        ]}
                      />
                    ))}
                  </CaseDetailKvCardList>
                )
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
