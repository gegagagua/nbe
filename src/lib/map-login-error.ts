import { isAxiosError } from 'axios';

import { LoginCopy } from '@/constants/login-copy';
import { extractApiErrorMessage } from '@/lib/extract-api-error-message';

export function mapLoginError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return LoginCopy.loginNetworkError;
    }
    if (error.response?.status === 401) {
      return LoginCopy.loginUnauthorized;
    }
    const data = error.response?.data;
    const fromBody = extractApiErrorMessage(data);
    if (fromBody) {
      return fromBody;
    }
  }
  return LoginCopy.loginGenericError;
}
