import axios, { isAxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import { ApiConfig, ApiPaths, EpsApiBase } from '@/constants/api';
import i18n from '@/i18n/i18n';
import { logApiError, logApiRequest, logApiResponse } from '@/lib/api-log';
import { clearSessionToken, getSessionToken } from '@/lib/session-token-storage';
import { clearSessionUserProfile } from '@/lib/session-user-profile-storage';
import { showErrorToast } from '@/lib/show-error-toast';
import { signOut } from '@/lib/sign-out';

function isAuthRequest(config: InternalAxiosRequestConfig) {
  const url = config.url ?? '';
  return (
    url.includes('/sessions/logout') ||
    url === ApiConfig.sessionsPath ||
    url === ApiPaths.userPasswordUpdate
  );
}

function isPublicEndpoint(url: string): boolean {
  return (
    url.endsWith(ApiPaths.usersCreate) ||
    url.endsWith(ApiPaths.usersVerifyPhone) ||
    url.endsWith(ApiPaths.usersVerificationCheck) ||
    url.endsWith(ApiPaths.usersResetPassword) ||
    url.includes(`${EpsApiBase}${ApiPaths.guestFineDebtCheck}`) ||
    url.endsWith(ApiPaths.guestFineDebtCheck) ||
    url === ApiPaths.otpSend ||
    url === ApiPaths.otpVerify ||
    url === ApiPaths.passwordReset ||
    url === ApiPaths.sessions
  );
}

export const apiClient = axios.create({
  baseURL: ApiConfig.baseUrl,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 60_000,
});

apiClient.interceptors.request.use(async (config) => {
  if (!isPublicEndpoint(config.url ?? '')) {
    const token = await getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  logApiRequest(config);
  return config;
});

function hadAuthorizationHeader(cfg: InternalAxiosRequestConfig | undefined): boolean {
  const value = cfg?.headers?.Authorization;
  return typeof value === 'string' && value.length > 0;
}

apiClient.interceptors.response.use(
  (response) => {
    logApiResponse(response);
    return response;
  },
  async (error: unknown) => {
    logApiError(error);
    if (!isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }
    const cfg = error.config;
    if (cfg && isAuthRequest(cfg)) {
      return Promise.reject(error);
    }
    if (!hadAuthorizationHeader(cfg)) {
      return Promise.reject(error);
    }
    showErrorToast(i18n.t('toast.sessionExpired'), error);
    await signOut();
    return Promise.reject(error);
  },
);
