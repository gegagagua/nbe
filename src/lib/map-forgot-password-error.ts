import { isAxiosError } from 'axios';

import i18n from '@/i18n/i18n';

export function mapForgotPasswordError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return i18n.t('forgotPassword.networkError');
    }
    const status = error.response?.status;
    // Personal ID is not registered → backend responds 404 (not found).
    if (status === 404 || status === 400) {
      return i18n.t('forgotPassword.notFoundError');
    }
  }
  return i18n.t('forgotPassword.genericError');
}
