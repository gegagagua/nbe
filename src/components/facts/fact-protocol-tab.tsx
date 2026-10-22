import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { streamFactFile } from "@/api/fact-files";
import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { LoginPalette } from "@/constants/login";
import { useFactProtocol } from "@/hooks/use-fact-protocol";
import {
  openAndroidViewer,
  prepareStreamedFile,
  shareCachedFile,
} from "@/lib/download-eps-file";
import { showErrorToast } from "@/lib/show-error-toast";
import type { FactProtocolFile, FactProtocolStatus } from "@/types/facts";

import { factsDetailStyles as d } from "./facts-detail.styles";
import { factProtocolStyles as s } from "./fact-protocol-tab.styles";

function FileRow({
  appId,
  file,
}: {
  appId: number;
  file: FactProtocolFile;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  const onOpen = async () => {
    setBusy(true);
    try {
      const prepared = await prepareStreamedFile(
        (responseType) => streamFactFile(appId, file.fileId, responseType),
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
    <Pressable
      style={s.fileRow}
      disabled={busy}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={t("facts.protocolDownloadA11y", { name: file.title })}
    >
      <MaterialCommunityIcons
        name="file-download-outline"
        size={22}
        color={LoginPalette.logoRed}
      />
      <View style={s.fileInfo}>
        <Text style={s.fileName} numberOfLines={2}>
          {file.title}
        </Text>
        {file.uploadedBy ? (
          <Text style={s.fileMeta}>{file.uploadedBy}</Text>
        ) : null}
        {file.createdDate ? (
          <Text style={s.fileMeta}>{file.createdDate}</Text>
        ) : null}
      </View>
      {busy ? (
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={DebtorRegistryPalette.textMuted}
        />
      )}
    </Pressable>
  );
}

function StatusGroup({ status }: { status: FactProtocolStatus }) {
  const { t } = useTranslation();
  const heading = [status.statusNumber, status.statusName]
    .filter(Boolean)
    .join(" — ");
  return (
    <View style={s.group}>
      {heading ? <Text style={s.groupTitle}>{heading}</Text> : null}
      {status.date ? <Text style={s.groupHint}>{status.date}</Text> : null}
      {status.files.length > 0 ? (
        status.files.map((f) => (
          <FileRow key={f.fileId} appId={status.appId} file={f} />
        ))
      ) : (
        <Text style={s.emptyLine}>{t("facts.protocolSectionEmpty")}</Text>
      )}
    </View>
  );
}

export function FactProtocolTab({ appId }: { appId: number }) {
  const { t } = useTranslation();
  const { data, isPending } = useFactProtocol(appId);

  if (isPending) {
    return (
      <View style={[d.detailsCard, d.section]}>
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      </View>
    );
  }

  const statuses = data ?? [];
  const hasFiles = statuses.some((st) => st.files.length > 0);

  if (statuses.length === 0 || !hasFiles) {
    return (
      <View style={[d.detailsCard, d.section]}>
        <Text style={s.intro}>{t("facts.detailProtocolEmpty")}</Text>
      </View>
    );
  }

  return (
    <View style={[d.detailsCard, d.section]}>
      <Text style={s.intro}>{t("facts.protocolIntro")}</Text>
      {statuses.map((st) => (
        <StatusGroup key={st.appStatusId} status={st} />
      ))}
    </View>
  );
}
