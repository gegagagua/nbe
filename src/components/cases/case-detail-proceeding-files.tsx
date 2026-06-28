import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { useStatusFiles } from "@/hooks/use-status-files";
import {
  openAndroidViewer,
  prepareEpsFile,
  type PreparedFile,
} from "@/lib/download-eps-file";
import { showErrorToast } from "@/lib/show-error-toast";

import { CaseDetailFileViewerModal } from "./case-detail-file-viewer-modal";
import { caseDetailInternalStyles as s } from "./case-detail-internal.styles";
import { caseDetailTableStyles as tb } from "./case-detail-tables.styles";

export function CaseDetailProceedingFiles({
  appId,
  appStatusId,
}: {
  appId?: number;
  appStatusId?: number;
}) {
  const { t } = useTranslation();
  const { profile } = useSessionUserProfile();
  const { data: files, isLoading } = useStatusFiles(appId, appStatusId);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [viewerFile, setViewerFile] = useState<PreparedFile | null>(null);

  if (isLoading) {
    return (
      <View style={s.stackGapSm}>
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      </View>
    );
  }

  if (!files || files.length === 0) {
    return (
      <Text style={[s.mutedText, s.stackGapSm]}>
        {t("cases.detail.proceedingsNoDocs")}
      </Text>
    );
  }

  const handleOpen = async (fileId: number, fileName: string) => {
    if (appId == null || profile?.id == null) return;
    setDownloadingId(fileId);
    try {
      const prepared = await prepareEpsFile({
        appId,
        fileId,
        fileName,
        userId: profile.id,
      });
      // Web already downloaded; nothing more to open.
      if (!prepared) return;
      if (Platform.OS === "android") {
        // Android opens the file directly in the default viewer app.
        await openAndroidViewer(prepared);
        return;
      }
      // iOS: open the file in the in-app reader so the user can read it first
      // and only then choose to download/share — instead of being dropped
      // straight into the share sheet.
      setViewerFile(prepared);
    } catch (err) {
      showErrorToast(t("cases.detail.fileDownloadError"), err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <View style={[tb.borderBox, s.claimsTableWrap]}>
      {files.map((file) => (
        <Pressable
          key={file.fileId}
          style={[tb.tableRow, s.fileRow]}
          onPress={() => handleOpen(file.fileId, file.fileName)}
          disabled={downloadingId != null}
          accessibilityRole="button"
          accessibilityLabel={t("cases.detail.docOpenA11y")}
        >
          <View style={s.fileInfo}>
            <Text style={s.linkText}>{file.title}</Text>
            {file.uploadedBy ? (
              <Text style={s.mutedText}>
                {t("cases.detail.fileUploadedBy", { name: file.uploadedBy })}
              </Text>
            ) : null}
            {file.createdDate ? (
              <Text style={s.mutedText}>{file.createdDate}</Text>
            ) : null}
          </View>
          {downloadingId === file.fileId ? (
            <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
          ) : (
            <MaterialCommunityIcons
              name="eye-outline"
              size={22}
              color={DebtorRegistryPalette.buttonBg}
            />
          )}
        </Pressable>
      ))}
      <CaseDetailFileViewerModal
        file={viewerFile}
        onClose={() => setViewerFile(null)}
      />
    </View>
  );
}
