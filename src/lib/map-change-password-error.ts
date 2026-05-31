import { isAxiosError } from 'axios';

import i18n from '@/i18n/i18n';
import { extractApiErrorMessage } from '@/lib/extract-api-error-message';

export function mapChangePasswordError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return i18n.t('profile.changePasswordNetworkError');
    }
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      const fromBody = extractApiErrorMessage(error.response?.data);
      return fromBody ?? i18n.t('profile.changePasswordInvalidCurrent');
    }
    const fromBody = extractApiErrorMessage(error.response?.data);
    if (fromBody) {
      return fromBody;
    }
  }
  return i18n.t('profile.changePasswordError');
}
