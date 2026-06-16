import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
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

import { paymentWebViewModalStyles as s } from "./payment-web-view-modal.styles";

type BodyProps = {
  url: string;
  onClose: () => void;
};

// Keywords that show up in BOG's terminal pages (success / failure / cancel /
// the merchant return URL). When any of them appears in the WebView URL we
// treat the payment as finished and close the modal so sync-status can fire.
const RESOLUTION_KEYWORDS = [
  "success",
  "succeed",
  "completed",
  "complete",
  "approved",
  "done",
  "finish",
  "result",
  "thank",
  "return",
  "callback",
  "redirect",
  "error",
  "fail",
  "declined",
  "cancel",
];

function isResolutionUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return RESOLUTION_KEYWORDS.some((kw) => lower.includes(kw));
}

function PaymentWebViewModalBody({ url, onClose }: BodyProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const initialUrlRef = useRef(url);
  const resolvedRef = useRef(false);

  const handleNavChange = (state: { url?: string }) => {
    if (resolvedRef.current) return;
    const next = state.url ?? "";
    // Ignore the initial load — only act on subsequent redirects.
    if (!next || next === initialUrlRef.current) return;
    if (!isResolutionUrl(next)) return;
    resolvedRef.current = true;
    onClose();
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
      <View style={s.header}>
        <Pressable
          style={s.closeHit}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t("cases.guestFine.paymentCloseA11yLabel")}
        >
          <MaterialCommunityIcons
            name="close"
            size={Layout.registerBackIconSize}
            color={LoginPalette.primary}
          />
          <Text style={s.closeLabel}>
            {t("cases.guestFine.paymentCloseLabel")}
          </Text>
        </Pressable>
      </View>
      <View style={s.webviewWrap}>
        <WebView
          source={{ uri: url }}
          style={s.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavChange}
          javaScriptEnabled
          domStorageEnabled
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
  visible: boolean;
  url: string | null;
  onClose: () => void;
};

export function PaymentWebViewModal({ visible, url, onClose }: Props) {
  if (!url) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <PaymentWebViewModalBody url={url} onClose={onClose} />
      </SafeAreaProvider>
    </Modal>
  );
}
