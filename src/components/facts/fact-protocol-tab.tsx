import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { streamFactFile } from "@/api/fact-files";
import { Card, PressableScale } from "@/components/ui";
import { useFactProtocol } from "@/hooks/use-fact-protocol";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import {
  openAndroidViewer,
  prepareStreamedFile,
  shareCachedFile,
} from "@/lib/download-eps-file";
import { showErrorToast } from "@/lib/show-error-toast";
import { useAppTheme } from "@/theme";
import type { FactProtocolFile, FactProtocolStatus } from "@/types/facts";

function FileRow({
  appId,
  userId,
  file,
}: {
  appId: number;
  userId: number;
  file: FactProtocolFile;
}) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [busy, setBusy] = useState(false);

  const onOpen = async () => {
    setBusy(true);
    try {
      const prepared = await prepareStreamedFile(
        (responseType) => streamFactFile(appId, file.fileId, userId, responseType),
        { fileId: file.fileId, fileName: file.fileName },
      );
      // Web already downloaded via the browser; nothing more to open.
      if (!prepared) return;
      if (Platform.OS === "android") {
        await openAndroidViewer(prepared);
      } else {
        await shareCachedFile(prepared);
      }
    } catch (err) {
      showErrorToast(t("facts.protocolDownloadError"), err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PressableScale
      className="flex-row items-center gap-2 rounded-md border border-border bg-input px-4 py-2"
      disabled={busy}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={t("facts.protocolDownloadA11y", { name: file.title })}
    >
      <MaterialCommunityIcons
        name="file-download-outline"
        size={22}
        color={colors.danger}
      />
      <View className="flex-1 gap-0.5">
        <Text className="text-body text-fg" numberOfLines={2}>
          {file.title}
        </Text>
        {file.uploadedBy ? (
          <Text className="text-label text-fg-muted">{file.uploadedBy}</Text>
        ) : null}
        {file.createdDate ? (
          <Text className="text-label text-fg-muted">{file.createdDate}</Text>
        ) : null}
      </View>
      {busy ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={colors.textMuted}
        />
      )}
    </PressableScale>
  );
}

function StatusGroup({
  status,
  userId,
}: {
  status: FactProtocolStatus;
  userId: number;
}) {
  const { t } = useTranslation();
  const heading = [status.statusNumber, status.statusName]
    .filter(Boolean)
    .join(" — ");
  return (
    <View className="gap-2">
      {heading ? (
        <Text className="text-body font-bold text-fg">{heading}</Text>
      ) : null}
      {status.date ? (
        <Text className="text-label text-fg-muted">{status.date}</Text>
      ) : null}
      {status.files.length > 0 ? (
        status.files.map((f) => (
          <FileRow key={f.fileId} appId={status.appId} userId={userId} file={f} />
        ))
      ) : (
        <Text className="text-label italic text-fg-muted">
          {t("facts.protocolSectionEmpty")}
        </Text>
      )}
    </View>
  );
}

export function FactProtocolTab({ appId }: { appId: number }) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { profile } = useSessionUserProfile();
  const userId = profile?.id ?? null;
  const { data, isPending } = useFactProtocol(appId, userId);

  if (isPending) {
    return (
      <Card>
        <ActivityIndicator color={colors.primary} />
      </Card>
    );
  }

  const statuses = data ?? [];

  // Show the status headings whenever there are statuses — even if a given
  // status has no (non-confidential) files yet, its "ოქმი ფაქტების
  // კონსტატაციის შესახებ" heading should still render. Only a truly empty
  // response falls back to the empty message.
  if (statuses.length === 0 || userId == null) {
    return (
      <Card>
        <Text className="text-label leading-relaxed text-fg-muted">
          {t("facts.detailProtocolEmpty")}
        </Text>
      </Card>
    );
  }

  return (
    <Card className="gap-4">
      <Text className="text-label leading-relaxed text-fg-muted">
        {t("facts.protocolIntro")}
      </Text>
      {statuses.map((st) => (
        <StatusGroup key={st.appStatusId} status={st} userId={userId} />
      ))}
    </Card>
  );
}
