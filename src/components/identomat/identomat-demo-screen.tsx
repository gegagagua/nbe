import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import {
  WebView,
  type WebViewMessageEvent,
  type WebViewNavigation,
} from 'react-native-webview';

import { AppSafeArea } from '@/components/ui/app-safe-area';
import { IDENTOMAT_DEMO_URL } from '@/constants/identomat';
import { Layout } from '@/constants/layout';
import { LoginPalette } from '@/constants/login';

import { identomatDemoScreenStyles } from './identomat-demo-screen.styles';

type IdentomatDemoScreenProps = {
  onBack: () => void;
  onSuccess?: () => void;
  isCheckingVerification?: boolean;
  sourceUrl?: string;
};

/**
 * Identomat's widget reports its lifecycle by posting string messages
 * (`identomat_finished`, `identomat_close`, …) to the window. We bridge those
 * to the native side via ReactNativeWebView.postMessage so we can close the
 * screen automatically when verification completes.
 */
const IDENTOMAT_MESSAGE_BRIDGE = `(function () {
  function send(data) {
    if (window.ReactNativeWebView && data != null) {
      window.ReactNativeWebView.postMessage(
        typeof data === 'string' ? data : JSON.stringify(data),
      );
    }
  }
  window.addEventListener('message', function (e) { send(e.data); });
})();
true;`;

// Terminal lifecycle events: once the widget finishes or closes itself we run
// the verification check on the native side. On completion the widget posts the
// bare string 'DONE' and an object `{ type: 'done', sessionId }` to its parent
// (see identomat-widget-next step-complete.tsx); it does NOT expose a
// `step=success` URL — the `step` param is removed entirely at the end.
const IDENTOMAT_TERMINAL_EVENTS = [
  'DONE',
  'identomat_finished',
  'identomat_close',
];

// Some terminal signals arrive as a JSON object string, e.g.
// `{"type":"done","sessionId":"…"}`. Detect the `done` type from the payload.
function isTerminalMessage(data: string): boolean {
  if (IDENTOMAT_TERMINAL_EVENTS.includes(data)) return true;
  try {
    const parsed = JSON.parse(data);
    return parsed?.type === 'done';
  } catch {
    return false;
  }
}

// The widget ends on a "Process finished" screen without changing its URL or
// (reliably) posting a lifecycle message, so neither the postMessage bridge nor
// the URL listener fire there. We detect that screen by its visible text
// instead and post `identomat_finished` ourselves. Markers cover the widget's
// Georgian and English copy; matching is lowercase + substring.
const IDENTOMAT_COMPLETION_TEXT_MARKERS = [
  'დასრულებულია',
  'process finished',
  'process is finished',
  'verification finished',
  'verification complete',
];

// Injected watcher: when the completion screen's text shows up, post the
// terminal event once. Mirrors the no-HD-camera injection's approach (initial
// pass + MutationObserver + interval) so it survives the widget's SPA renders.
const IDENTOMAT_COMPLETION_INJECTION = `(function () {
  var MARKERS = ${JSON.stringify(IDENTOMAT_COMPLETION_TEXT_MARKERS)};
  var done = false;

  function check() {
    if (done) return;
    var text = (document.body && document.body.innerText || '').toLowerCase();
    for (var i = 0; i < MARKERS.length; i++) {
      if (text.indexOf(MARKERS[i]) !== -1) {
        done = true;
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage('identomat_finished');
        }
        return;
      }
    }
  }

  check();
  try {
    var observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  setInterval(check, 800);
})();
true;`;

// After the user clears every KYC step, Identomat navigates the widget to a
// result URL. The session URL is `widget.identomat.com/?session_token=…`, so
// these markers only appear on the post-flow redirect — that URL change is our
// signal that the flow is done (a complement to the postMessage bridge, which
// can be unreliable across the widget's SPA navigation).
const IDENTOMAT_COMPLETION_URL_MARKERS = [
  'success',
  'result',
  'finished',
  'finish',
  'complete',
  'done',
  'error',
];

function isCompletionUrl(url: string | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return IDENTOMAT_COMPLETION_URL_MARKERS.some((marker) =>
    lower.includes(marker),
  );
}

/**
 * The Identomat widget falls back to a QR / copy-link card when the device has
 * no Full HD camera. That card renders top-left and without a heading, so we
 * inject our own (localized) "Full HD camera not detected" title + description
 * and center the card. The widget is an SPA, so we watch for the card to
 * appear via a MutationObserver and re-apply idempotently.
 */
function buildNoHdCameraInjection(title: string, description: string): string {
  return `(function () {
  var TITLE = ${JSON.stringify(title)};
  var DESC = ${JSON.stringify(description)};
  var MARKER = 'following methods';
  var STYLE_ID = 'nbe-hd-style';
  var BLOCK_ID = 'nbe-hd-block';

  function findHeading() {
    var nodes = document.querySelectorAll('div, p, h1, h2, h3, span');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children.length === 0 && el.textContent &&
          el.textContent.toLowerCase().indexOf(MARKER) !== -1) {
        return el;
      }
    }
    return null;
  }

  function getCard(headingEl) {
    var el = headingEl;
    while (el && el !== document.body) {
      if (el.querySelector &&
          (el.querySelector('canvas') || el.querySelector('img') || el.querySelector('svg'))) {
        return el;
      }
      el = el.parentElement;
    }
    return headingEl.parentElement;
  }

  // Remember the inline styles we overwrite so we can fully restore the page
  // if the fallback card goes away (e.g. the camera check later succeeds).
  var touched = [];

  function ensureBaseStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.innerHTML = 'html,body{height:100%;margin:0;}';
    document.head.appendChild(style);
  }

  function center(el) {
    if (el.getAttribute('data-nbe-centered')) return;
    touched.push({ el: el, css: el.getAttribute('style') || '' });
    el.setAttribute('data-nbe-centered', '1');
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.minHeight = '100%';
    el.style.width = '100%';
    el.style.boxSizing = 'border-box';
  }

  // Center the card by turning every ancestor up to <body> into a flex box that
  // centers its content. This survives full-width wrapper divs that would
  // otherwise pin the card to the top-left corner.
  function centerCard(card) {
    var el = card.parentElement;
    while (el) {
      center(el);
      if (el === document.body) break;
      el = el.parentElement;
    }
  }

  function reset() {
    var style = document.getElementById(STYLE_ID);
    if (style) style.remove();
    var block = document.getElementById(BLOCK_ID);
    if (block) block.remove();
    for (var i = 0; i < touched.length; i++) {
      var t = touched[i];
      t.el.removeAttribute('data-nbe-centered');
      if (t.css) t.el.setAttribute('style', t.css);
      else t.el.removeAttribute('style');
    }
    touched = [];
  }

  function apply() {
    var heading = findHeading();
    if (!heading) {
      if (touched.length || document.getElementById(BLOCK_ID)) reset();
      return;
    }
    var card = getCard(heading);
    if (!card) return;
    ensureBaseStyle();
    centerCard(card);
    if (!document.getElementById(BLOCK_ID)) {
      var block = document.createElement('div');
      block.id = BLOCK_ID;
      block.style.textAlign = 'center';
      block.style.marginBottom = '16px';
      block.innerHTML =
        '<div style="font-size:20px;font-weight:700;color:#1f2937;margin-bottom:8px;">' +
        TITLE + '</div>' +
        '<div style="font-size:15px;color:#5b6b8c;">' + DESC + '</div>';
      card.insertBefore(block, card.firstChild);
    }
  }

  apply();
  try {
    var observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  setInterval(apply, 800);
})();
true;`;
}

export function IdentomatDemoScreen({ onBack, onSuccess, sourceUrl, isCheckingVerification }: IdentomatDemoScreenProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  // Tracks whether the very first page load has completed. Identomat redirects
  // its session URL and then behaves as an SPA; on Android react-native-webview
  // re-fires onLoadStart for every redirect / in-widget navigation, and the
  // matching onLoadEnd is unreliable. Without this guard the opaque overlay
  // gets re-shown by a later onLoadStart and never hidden again — the spinner
  // hangs and the camera flow can't proceed (Android-only symptom).
  const hasLoadedRef = useRef(false);
  // Both the postMessage bridge and the URL listener can report completion;
  // this ensures the verification check runs exactly once.
  const hasFinishedRef = useRef(false);

  const finish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    onSuccess?.();
  }, [onSuccess]);

  const handleLoadStart = useCallback(() => {
    if (!hasLoadedRef.current) setLoading(true);
  }, []);

  const finishLoading = useCallback(() => {
    hasLoadedRef.current = true;
    setLoading(false);
  }, []);

  const handleLoadProgress = useCallback(
    ({ nativeEvent }: { nativeEvent: { progress: number } }) => {
      // onLoadEnd can fail to fire on Android; progress reaching 1 is the
      // reliable signal that the initial document has finished loading.
      if (nativeEvent.progress >= 1) finishLoading();
    },
    [finishLoading],
  );

  const injectedJavaScript = useMemo(
    () =>
      buildNoHdCameraInjection(
        t('login.identomatNoHdCameraTitle'),
        t('login.identomatNoHdCameraDescription'),
      ) +
      IDENTOMAT_MESSAGE_BRIDGE +
      IDENTOMAT_COMPLETION_INJECTION,
    [t],
  );

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      console.log('[Identomat] message:', event.nativeEvent.data);
      if (isTerminalMessage(event.nativeEvent.data)) {
        finish();
      }
    },
    [finish],
  );

  // Watch the widget's URL: when it navigates to a result/success/error URL the
  // user has been through every step, so we kick off the verification check.
  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      if (navState.loading) return;
      if (isCompletionUrl(navState.url)) finish();
    },
    [finish],
  );

  return (
    <View style={identomatDemoScreenStyles.page}>
      <AppSafeArea style={identomatDemoScreenStyles.safe} edges={['top']}>
        <View style={identomatDemoScreenStyles.navRow}>
          <Pressable
            style={identomatDemoScreenStyles.hit}
            onPress={onBack}
            disabled={isCheckingVerification}
            accessibilityRole="button"
            accessibilityLabel={t('login.identomatDemoBackA11yLabel')}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={Layout.registerBackIconSize}
              color={LoginPalette.primary}
            />
            <Text style={identomatDemoScreenStyles.backLabel}>
              {t('login.identomatDemoPageTitle')}
            </Text>
          </Pressable>
        </View>
        <View style={identomatDemoScreenStyles.webviewWrap}>
          <WebView
            source={{ uri: sourceUrl ?? IDENTOMAT_DEMO_URL }}
            style={identomatDemoScreenStyles.webview}
            onLoadStart={handleLoadStart}
            onLoadEnd={finishLoading}
            onLoadProgress={handleLoadProgress}
            onMessage={handleMessage}
            onNavigationStateChange={handleNavigationStateChange}
            javaScriptEnabled
            domStorageEnabled
            // Camera + mic access for Identomat's liveness / KYC capture.
            // iOS: render the camera inline (not the native fullscreen player),
            // allow getUserMedia without a tap, and auto-grant the WKWebView
            // capture prompt once the OS permission is granted. Android grants
            // are handled natively by react-native-webview once CAMERA is
            // declared in the manifest (see app.json android.permissions).
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            mediaCapturePermissionGrantType="grant"
            injectedJavaScript={injectedJavaScript}
          />
          {(loading || isCheckingVerification) ? (
            <View style={identomatDemoScreenStyles.loadingOverlay}>
              <ActivityIndicator size="large" color={LoginPalette.primary} />
            </View>
          ) : null}
        </View>
      </AppSafeArea>
    </View>
  );
}
