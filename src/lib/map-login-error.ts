import { isAxiosError } from 'axios';

import i18n from '@/i18n/i18n';
import { extractApiErrorMessage } from '@/lib/extract-api-error-message';

export function mapLoginError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return i18n.t('login.loginNetworkError');
    }
    // Prefer the backend-provided message (e.g. USER_LOCKED → "თქვენი ანგარიში დაიბლოკა 10 წუთით!").
    const fromBody = extractApiErrorMessage(error.response?.data);
    if (fromBody) {
      return fromBody;
    }
    const status = error.response?.status;
    // Fallbacks when the backend doesn't include a message.
    if (status === 423 || status === 429) {
      return i18n.t('login.loginLockout');
    }
    if (status === 401) {
      return i18n.t('login.loginUnauthorized');
    }
  }
  return i18n.t('login.loginGenericError');
}
