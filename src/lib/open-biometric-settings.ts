import * as IntentLauncher from 'expo-intent-launcher';
import { Linking, Platform } from 'react-native';

// Android's biometric-enrollment screen. `BIOMETRIC_ENROLL` exists on API 30+;
// older releases fall back to the general security settings, and anything else
// to the app's own settings page — so the button always lands the user somewhere
// they can set up Face unlock / fingerprint.
const ANDROID_BIOMETRIC_ENROLL = 'android.settings.BIOMETRIC_ENROLL';
const ANDROID_SECURITY_SETTINGS = 'android.settings.SECURITY_SETTINGS';

/**
 * Take the user to where they can enrol a biometric (NM-319 #3). Android has no
 * runtime biometric permission, so when Face unlock / fingerprint isn't set up we
 * can't prompt for it in-app — the best we can do is open the OS enrollment
 * screen. iOS never reaches this path (Face ID consent is requested automatically
 * on first use), but we still open app settings there as a safe fallback.
 */
export async function openBiometricSettings(): Promise<void> {
  if (Platform.OS !== 'android') {
    await Linking.openSettings();
    return;
  }
  try {
    await IntentLauncher.startActivityAsync(ANDROID_BIOMETRIC_ENROLL);
  } catch {
    try {
      await IntentLauncher.startActivityAsync(ANDROID_SECURITY_SETTINGS);
    } catch {
      await Linking.openSettings();
    }
  }
}
