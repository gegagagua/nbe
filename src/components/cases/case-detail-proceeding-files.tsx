import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { useStatusFiles } from "@/hooks/use-status-files";
import { downloadEpsFile } from "@/lib/download-eps-file";
import { showErrorToast } from "@/lib/show-error-toast";

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

  const handleDownload = async (fileId: number, fileName: string) => {
    if (appId == null || profile?.id == null) return;
    setDownloadingId(fileId);
    try {
      await downloadEpsFile({ appId, fileId, fileName, userId: profile.id });
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
          onPress={() => handleDownload(file.fileId, file.fileName)}
          disabled={downloadingId != null}
          accessibilityRole="button"
          accessibilityLabel={t("cases.detail.fileDownloadA11y")}
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
              name="download"
              size={22}
              color={DebtorRegistryPalette.buttonBg}
            />
          )}
        </Pressable>
      ))}
    </View>
  );
}
