import { isAxiosError } from 'axios';

import { extractApiErrorMessage } from '@/lib/extract-api-error-message';

function stringifyResponseData(data: unknown): string | undefined {
  if (data === undefined || data === null) {
    return undefined;
  }
  if (typeof data === 'string') {
    return data;
  }
  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
}

export function logBackendError(error: unknown, context?: string) {
  const label = context ?? 'backend';

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const backendMessage = extractApiErrorMessage(data);
    const responseJson = stringifyResponseData(data);
    console.error(`[${label}]`, {
      status,
      backendMessage: backendMessage ?? null,
      responseBodyJson: responseJson,
      axiosMessage: error.message,
    });
    return;
  }

  console.error(`[${label}]`, error);
}
