import { isAxiosError } from 'axios';

import i18n from '@/i18n/i18n';
import { extractApiErrorMessage } from '@/lib/extract-api-error-message';

export function mapUpdateUserError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return i18n.t('profile.saveNetworkError');
    }
    const fromBody = extractApiErrorMessage(error.response?.data);
    if (fromBody) {
      return fromBody;
    }
  }
  return i18n.t('profile.saveError');
}
