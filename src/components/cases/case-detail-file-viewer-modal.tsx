import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { Layout } from "@/constants/layout";
import { Space } from "@/constants/theme";
import { useAppTheme } from "@/theme";
import type { PreparedFile } from "@/lib/download-eps-file";
import { shareCachedFile } from "@/lib/download-eps-file";
import { showErrorToast } from "@/lib/show-error-toast";

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
  const { colors } = useAppTheme();
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
      className="flex-1 bg-bg"
      style={{
        paddingTop: insets.top + Space.small,
        paddingBottom: insets.bottom + Space.small,
      }}
    >
      <View className="mb-2 flex-row items-center justify-between px-4">
        <Pressable
          className="flex-row items-center gap-1 py-2 pr-4"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t("cases.detail.fileViewerCloseA11y")}
        >
          <MaterialCommunityIcons
            name="close"
            size={Layout.registerBackIconSize}
            color={colors.primary}
          />
          <Text className="text-body font-semibold text-primary">{t("cases.detail.fileViewerClose")}</Text>
        </Pressable>
        <Pressable
          className="flex-row items-center gap-1 py-2 pr-4"
          onPress={() => {
            handleShare();
          }}
          accessibilityRole="button"
          accessibilityLabel={t("cases.detail.fileViewerShareA11y")}
        >
          <MaterialCommunityIcons
            name={actionIcon ?? "export-variant"}
            size={Layout.registerBackIconSize}
            color={colors.primary}
          />
          <Text className="text-body font-semibold text-primary">
            {actionLabel ?? t("cases.detail.fileViewerShare")}
          </Text>
        </Pressable>
      </View>
      <View className="mx-4 flex-1 overflow-hidden rounded-sm bg-surface">
        <WebView
          source={{ uri: file.uri }}
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          allowFileAccess
          allowingReadAccessToURL={dirOf(file.uri)}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {loading ? (
          <View
            className="z-10 items-center justify-center bg-surface"
            style={StyleSheet.absoluteFill}
          >
            <ActivityIndicator size="large" color={colors.primary} />
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
