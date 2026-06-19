import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { isAxiosError } from "axios";

const SENSITIVE_FIELDS = new Set([
  "password",
  "pwd",
  "retypePwd",
  "newPwd",
  "retypeNewPwd",
  "crntPwd",
  "currentPassword",
  "newPassword",
  "confirmPassword",
  "token",
]);

function redact(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_FIELDS.has(k)) {
      out[k] = typeof v === "string" && v.length > 0 ? "***" : v;
    } else {
      out[k] = redact(v);
    }
  }
  return out;
}

function stringifyBody(body: unknown): unknown {
  if (body === undefined || body === null) return undefined;
  if (typeof body === "string") {
    try {
      return redact(JSON.parse(body));
    } catch {
      return body;
    }
  }
  return redact(body);
}

function describe(cfg: InternalAxiosRequestConfig | undefined) {
  const method = (cfg?.method ?? "get").toUpperCase();
  const rawUrl = cfg?.url ?? "";
  const isAbsolute = /^https?:\/\//i.test(rawUrl);
  const url = isAbsolute ? rawUrl : `${cfg?.baseURL ?? ""}${rawUrl}`;
  return { method, url };
}

function describeHeaders(headers: unknown): Record<string, string> | undefined {
  if (!headers || typeof headers !== "object") return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
    if (k.toLowerCase() === "authorization") {
      out[k] = v ? "Bearer ***" : "";
      continue;
    }
    if (typeof v === "string") out[k] = v;
    else if (typeof v === "number") out[k] = String(v);
  }
  return out;
}

export function logApiRequest(config: InternalAxiosRequestConfig): void {
  if (!__DEV__) return;
  const { method, url } = describe(config);
  console.log(`[API →] ${method} ${url}`, {
    headers: describeHeaders(config.headers),
    body: stringifyBody(config.data),
  });
}

export function logApiResponse(response: AxiosResponse): void {
  if (!__DEV__) return;
  const { method, url } = describe(response.config);
  console.log(`[API ← ${response.status}] ${method} ${url}`, {
    body: stringifyBody(response.data),
  });
}

export function logApiError(error: unknown, context?: string): void {
  const label = context ? `[API ✗ ${context}]` : "[API ✗]";
  if (!isAxiosError(error)) {
    console.error(`${label} non-axios error: ${String(error)}`);
    return;
  }
  const status = error.response?.status ?? 0;
  const { method, url } = describe(error.config);
  const body = JSON.stringify(stringifyBody(error.response?.data), null, 2);
  console.error(status, method, url, body);
}
