import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { Layout } from "@/constants/layout";
import { LoginPalette } from "@/constants/login";
import { Space } from "@/constants/theme";
import type { PreparedFile } from "@/lib/download-eps-file";
import { shareCachedFile } from "@/lib/download-eps-file";
import { showErrorToast } from "@/lib/show-error-toast";

import { paymentWebViewModalStyles as s } from "@/components/ui/payment-web-view-modal.styles";

type BodyProps = {
  file: PreparedFile;
  onClose: () => void;
  /** Overrides the header action label; defaults to the case "share" wording. */
  actionLabel?: string;
  actionIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

/** Directory the cached file lives in — iOS WebView needs read access to it. */
function dirOf(uri: string): string {
  const idx = uri.lastIndexOf("/");
  return idx >= 0 ? uri.slice(0, idx + 1) : uri;
}

function FileViewerModalBody({ file, onClose, actionLabel, actionIcon }: BodyProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  const handleShare = async () => {
    try {
      await shareCachedFile(file);
    } catch (err) {
      showErrorToast(t("cases.detail.fileDownloadError"), err);
    }
  };

  return (
    <View
      style={[
        s.page,
        {
          paddingTop: insets.top + Space.small,
          paddingBottom: insets.bottom + Space.small,
        },
      ]}
    >
      <View style={[s.header, { justifyContent: "space-between" }]}>
        <Pressable
          style={s.closeHit}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t("cases.detail.fileViewerCloseA11y")}
        >
          <MaterialCommunityIcons
            name="close"
            size={Layout.registerBackIconSize}
            color={LoginPalette.primary}
          />
          <Text style={s.closeLabel}>{t("cases.detail.fileViewerClose")}</Text>
        </Pressable>
        <Pressable
          style={s.closeHit}
          onPress={() => {
            handleShare();
          }}
          accessibilityRole="button"
          accessibilityLabel={t("cases.detail.fileViewerShareA11y")}
        >
          <MaterialCommunityIcons
            name={actionIcon ?? "export-variant"}
            size={Layout.registerBackIconSize}
            color={LoginPalette.primary}
          />
          <Text style={s.closeLabel}>
            {actionLabel ?? t("cases.detail.fileViewerShare")}
          </Text>
        </Pressable>
      </View>
      <View style={s.webviewWrap}>
        <WebView
          source={{ uri: file.uri }}
          style={s.webview}
          originWhitelist={["*"]}
          allowFileAccess
          allowingReadAccessToURL={dirOf(file.uri)}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {loading ? (
          <View style={s.loadingOverlay}>
            <ActivityIndicator size="large" color={LoginPalette.primary} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

type Props = {
  file: PreparedFile | null;
  onClose: () => void;
  actionLabel?: string;
  actionIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function CaseDetailFileViewerModal({
  file,
  onClose,
  actionLabel,
  actionIcon,
}: Props) {
  if (!file) return null;

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <FileViewerModalBody
          file={file}
          onClose={onClose}
          actionLabel={actionLabel}
          actionIcon={actionIcon}
        />
      </SafeAreaProvider>
    </Modal>
  );
}
