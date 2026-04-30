import { isAxiosError } from 'axios';

import i18n from '@/i18n/i18n';
import { extractApiErrorMessage } from '@/lib/extract-api-error-message';

export function mapLoginError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return i18n.t('login.loginNetworkError');
    }
    if (error.response?.status === 401) {
      return i18n.t('login.loginUnauthorized');
    }
    const data = error.response?.data;
    const fromBody = extractApiErrorMessage(data);
    if (fromBody) {
      return fromBody;
    }
  }
  return i18n.t('login.loginGenericError');
}
