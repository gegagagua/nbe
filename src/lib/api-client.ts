import axios, { isAxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import { ApiConfig } from '@/constants/api';
import i18n from '@/i18n/i18n';
import { clearSessionToken, getSessionToken } from '@/lib/session-token-storage';
import { clearSessionUserProfile } from '@/lib/session-user-profile-storage';
import { showErrorToast } from '@/lib/show-error-toast';
import { signOut } from '@/lib/sign-out';

function isAuthRequest(config: InternalAxiosRequestConfig) {
  const url = config.url ?? '';
  return (
    url.includes('/sessions/logout') ||
    url === ApiConfig.sessionsPath
  );
}

export const apiClient = axios.create({
  baseURL: ApiConfig.baseUrl,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 60_000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }
    const cfg = error.config;
    if (cfg && isAuthRequest(cfg)) {
      return Promise.reject(error);
    }
    showErrorToast(i18n.t('toast.sessionExpired'), error);
    await signOut();
    return Promise.reject(error);
  },
);
