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
  // JSON.stringify instead of passing the object — Metro's console collapses
  // nested values to `[Object]`, hiding the actual response shape.
  console.log(
    `[API ← ${response.status}] ${method} ${url}`,
    JSON.stringify(redact(response.data), null, 2),
  );
}

/** Best-effort human-readable reason pulled from a response body. */
function reasonFromData(data: unknown): string | undefined {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["message", "error_description", "error", "detail", "title"]) {
      const value = obj[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return undefined;
}

/** Whether the failed request actually carried a non-empty Authorization header. */
function wasAuthorized(cfg: InternalAxiosRequestConfig | undefined): boolean {
  const value = cfg?.headers?.Authorization;
  return typeof value === "string" && value.length > 0;
}

export function logApiError(error: unknown, context?: string): void {
  const label = context ? `[API ✗ ${context}]` : "[API ✗]";
  if (!isAxiosError(error)) {
    console.error(`${label} non-axios error: ${String(error)}`);
    return;
  }
  const status = error.response?.status ?? 0;
  const { method, url } = describe(error.config);
  const authorized = wasAuthorized(error.config);
  // A 401/403 with an empty body carries its real reason in the status line or
  // in whether a token was even attached — surface both instead of logging `""`.
  const reason =
    reasonFromData(error.response?.data) ??
    (error.response?.statusText?.trim() || undefined) ??
    (status === 401 && !authorized
      ? "no Authorization header sent (missing/expired session token)"
      : undefined) ??
    error.message;
  const rawBody = error.response?.data;
  const isEmptyBody =
    rawBody == null || (typeof rawBody === "string" && rawBody.length === 0);
  console.error(
    `${label} ${status || "network"} ${method} ${url} — ${reason}`,
    {
      authorized,
      statusText: error.response?.statusText || undefined,
      // Distinguish "server sent no body" from a real payload we failed to read.
      body: isEmptyBody ? "<empty — server returned no error body>" : stringifyBody(rawBody),
    },
  );
}
