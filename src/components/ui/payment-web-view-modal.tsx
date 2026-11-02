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
import { useAppTheme } from "@/theme";

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

const MERCHANT_RETURN_HOSTS = ["nbe.gov.ge"];

function isResolutionUrl(url: string): boolean {
  const lower = url.toLowerCase();
  if (MERCHANT_RETURN_HOSTS.some((host) => lower.includes(host))) return true;
  return RESOLUTION_KEYWORDS.some((kw) => lower.includes(kw));
}

function PaymentWebViewModalBody({ url, onClose }: BodyProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const initialUrlRef = useRef(url);
  const resolvedRef = useRef(false);
  const leftInitialRef = useRef(false);

  const finish = () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    onClose();
  };

  const handleNavChange = (state: { url?: string }) => {
    if (resolvedRef.current) return;
    const next = state.url ?? "";
    // Ignore the initial load — only act on subsequent redirects.
    if (!next || next === initialUrlRef.current) return;
    leftInitialRef.current = true;
    if (!isResolutionUrl(next)) return;
    finish();
  };

  // Once the provider has redirected away from the payment page, a failed load
  // means it pointed at a merchant return URL the WebView cannot render. The
  // payment itself is already settled, so close instead of stranding the user
  // on an error page — sync-status then resolves the real outcome.
  const handleLoadFailure = () => {
    if (leftInitialRef.current) finish();
  };

  return (
    <View
      className="flex-1 bg-bg"
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 8,
      }}
    >
      <View className="flex-row items-center px-4 mb-2">
        <Pressable
          className="flex-row items-center gap-1 py-2 pr-4"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t("cases.guestFine.paymentCloseA11yLabel")}
        >
          <MaterialCommunityIcons
            name="close"
            size={Layout.registerBackIconSize}
            color={colors.primary}
          />
          <Text className="text-body-lg font-semibold text-primary">
            {t("cases.guestFine.paymentCloseLabel")}
          </Text>
        </Pressable>
      </View>
      <View className="flex-1 mx-4 rounded-sm overflow-hidden bg-surface">
        <WebView
          source={{ uri: url }}
          style={{ flex: 1 }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavChange}
          onError={handleLoadFailure}
          onHttpError={handleLoadFailure}
          javaScriptEnabled
          domStorageEnabled
        />
        {loading ? (
          <View className="absolute inset-0 z-[1] items-center justify-center bg-surface">
            <ActivityIndicator size="large" color={colors.primary} />
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
