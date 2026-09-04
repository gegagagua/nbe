// Pulls the human-readable message the gateway returns on an error response.
// UM/WebAuthn errors nest it under `errors[0].message` (e.g. the 409
// "აღნიშნული მოწყობილობა უკვე რეგისტრირებულია!"); other services put a plain
// `message` at the top level. Returns undefined when there's nothing usable, so
// callers can fall back to a localized string.
export function backendErrorMessage(error: unknown): string | undefined {
  const data = (error as { response?: { data?: unknown } })?.response?.data;
  if (!data || typeof data !== 'object') return undefined;
  const obj = data as Record<string, unknown>;

  if (Array.isArray(obj.errors)) {
    const nested = obj.errors
      .map((e) => (e as { message?: unknown })?.message)
      .find((m): m is string => typeof m === 'string' && m.trim().length > 0);
    if (nested) return nested.trim();
  }

  return typeof obj.message === 'string' && obj.message.trim()
    ? obj.message.trim()
    : undefined;
}
