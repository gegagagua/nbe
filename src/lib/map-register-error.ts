import { isAxiosError } from 'axios';

import i18n from '@/i18n/i18n';
import { extractApiErrorMessage } from '@/lib/extract-api-error-message';

export function mapRegisterError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return i18n.t('login.registerNetworkError');
    }
    const status = error.response?.status;
    if (status === 409 || status === 422) {
      const fromBody = extractApiErrorMessage(error.response?.data);
      return fromBody ?? i18n.t('login.registerDuplicateError');
    }
    const fromBody = extractApiErrorMessage(error.response?.data);
    if (fromBody) {
      return fromBody;
    }
  }
  return i18n.t('login.registerCreateError');
}
